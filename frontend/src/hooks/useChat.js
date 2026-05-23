import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export function useChatHistory(documentId) {
    return useQuery({
        queryKey: ['chat', documentId],
        queryFn: async () => {
            const {data} = await api.get(`/chat/${documentId}/history`)
            return data
        },
        enabled: !!documentId
    })
}

export function useAskQuestion(documentId) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ( question ) => {
            const { data } = await api.post(`/chat/${documentId}/ask`, { question })
            return data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['chat', documentId] })   
        }
    })
}