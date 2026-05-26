import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export function useDocuments() {
    return useQuery({
        queryKey: ['documents'],
        queryFn: async () => {
            const { data } = await api.get('/documents')
            return data.documents
        },
        refetchInterval: (query) => {
            const docs = query.state.data
            const hasProcessing = docs?.some(
                d => d.status === 'pending' || d.status === 'processing'
            )
            return hasProcessing ? 3000 : false
        }
    })
}

export function useSuggestedQuestions(documentId, enabled) {
    return useQuery({
        queryKey: ['suggestions', documentId],
        queryFn: async () => {
            const {data} = await api.get(`/documents/${documentId}/suggestions`)
            return data.questions
        },
        enabled: !!documentId && enabled,
        staleTime: Infinity, //never refetch - questions won't change and we don't want to refetch on window focus
    })
}

export function useUploadDocument() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (file) => {
            const form = new FormData()
            form.append('file', file)
            const { data } = await api.post('/documents/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['documents'] })   
        }
    })
}


export function useDeleteDocument() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (id) => {
            await api.delete(`/documents/${id}`)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['documents'] })   
        }
    })
}