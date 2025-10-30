import prisma from '../db.js'
import {v4 as uuidv4} from 'uuid'

//Get all boards
export const getAllBoards = async (req, res) => {
    try {
        const boards = await prisma.board.findMany({
            where: { authorId: req.user.id },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({success: true, data: boards});
    } catch (error) {
        res.json({success: false, error: error.message})
    }    
}

//Get a specific board
export const getBoardById = async (req, res) => {
    try {
        const { boardId} = req.params;
        const board = await prisma.board.findUnique({
            where: { id : Number(boardId)}
    })
    res.json(board)
    } catch (error) {
        res.json({error: error.message})
    }
}

export const createWhiteboard = async (req, res) => {
    const { title, content } = req.body;
    try {
        if (!title || !content) {
          return res.status(400).json({ error: "Missing required fields" });
        }
        const board = await prisma.board.create({
            data: { title, content, authorId: req.user.id }
        })
        res.json({success: true, data: board})
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

export const updateWhiteboard = async (req, res) => {
    const { boardId } = req.params;
    const { title, content } = req.body;
    try {
        const updated = await prisma.board.update({
            where: { id: Number(boardId) },
            data: { title, content }
        })
        res.json(updated)
    } catch (error) {
        res.json({error: error.message})
    }
}

export const deleteWhiteboard = async (req, res) => {
    const { boardId } = req.params;
    try {
        await prisma.board.delete({
            where: { id: Number(boardId) }
        })
        res.json({ success: true, message: "Board deleted." })
    } catch (error) {
        res.json({error: error.message})
    }
}

export const saveDrawingEvent = async (req, res) => {
    const {boardId} = req.params
    const {eventType, eventData} = req.body
    try {
        const event = await prisma.event.create({
            data: {
                board_id: Number(boardId),
                user_id: req.user.id,
                event_type: eventType,
                event_data: JSON.parse(eventData)
            }
        })
        res.json({success:true, data: event})
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

export const getBoardEvents = async (req, res) => {
    const {boardId} = req.params
    try {
        const events = await prisma.event.findMany({
            where: {board_id: Number(boardId)},
            orderBy: {createdAt: 'asc'}
        })
        res.json({success: true, data: events})
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

export const clearBoardEvents = async (req,res) => {
    const { boardId } = req.params
    try {
        await prisma.event.deleteMany({
            where: {board_id: Number(boardId)}
        })
        res.json({success: true, message: "Board events cleared"})
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

export const createInvite = async (req, res) => {
    try {
        const { boardId } = req.params
        const user = req.user
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized"})

        const board = await prisma.board.findUnique({ where: { id: Number(boardId) } })
        if (!board) return res.status(404).json({ success: false, message: "Board not found" })
        
        if (board.authorId !== user.id) {
            const membership = await prisma.boardMember.findUnique({ where: { boardId_userId: {boardId: Number(boardId), userId: user.id} } })
            if (!membership) return res.status(403).json({ success: false, message: "Forbidden"})
        }
        
        const inviteToken = uuidv4()
        const invite = await prisma.boardInvite.create({
            data : {
                boardId: Number(boardId),
                token: inviteToken
            }
        })
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
        const link = `${clientUrl}/join/${inviteToken}`

        res.json({ success: true, data: { inviteId: invite.id, link, inviteToken } })
    } catch (error) {
        return res.json({success: false, error: error.message})
    }
}

export const acceptInvite = async (req, res) => {
    try {
        const { inviteToken } = req.body
        const user = req.user
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized"})

        const invite = await prisma.boardInvite.findUnique({ where: { token: inviteToken } })
        if (!invite) return res.status(404).json({ success: false, message: "Invite not found" })

        const boardId = invite.boardId

        const existing = await prisma.boardMember.findUnique({
            where: { boardId_userId: { boardId: Number(boardId), userId: user.id } }
        })
        if (!existing) {
            await prisma.boardMember.create({
                data: {
                    boardId: invite.boardId,
                    userId: user.id,
                    role: 'collaborator'
                }
            })
        }
        res.json({ success: true, message: "Joined board successfully", data: { boardId } })
    } catch (error) {
        return res.json({success: false, error: error.message})
    }
}
