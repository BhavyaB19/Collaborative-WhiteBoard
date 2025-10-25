import axiosInstance from "./helper";

export const boardEventService = {
    saveEvent: async (boardId, eventType, eventData) => {
        try {
            const response = await axiosInstance.post(`/api/boards/${boardId}/events`, {
                eventType, 
                eventData: JSON.stringify(eventData)
            })
            return response.data
        } catch (error) {
            console.error('Error saving event:', error)
            throw error
        }
    },

    getEvents: async (boardId) => {
        try {
            const response = await axiosInstance.get(`/api/boards/${boardId}/events`)
            return response.data
        } catch (error) {
            console.error('Error fetching events:', error)
            throw error
        }
    },

    clearEvents: async (boardId) => {
        try {
            const response = await axiosInstance.delete(`api/boards/${boardId}/events`)
            return response.data
        } catch (error) {
            console.error('Error clearing events:', error)
            throw error
        }
    }
}