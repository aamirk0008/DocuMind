import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export function useDocuments() {
    return useQuery({
        queryKey: ['documents'],
        queryFn: async () => {
            const { data } = await api.get('/documents')
            return data.documents
        }
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