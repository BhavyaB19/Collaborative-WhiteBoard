import prisma from '../db.js'

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