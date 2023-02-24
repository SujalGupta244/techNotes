import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";


const notesAdapter = createEntityAdapter({
    sortComparer: (a,b) => (a.completed === b.completed) ? 0 : a.comepleted ? 1 : -1
})

const initialState = notesAdapter.getInitialState()


export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => ({
                url: '/notes',
                validateState: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            // keepUnusedDataFor: 5,
            transformResponse: responseData =>{
                const loadedNotes = responseData.map(note => {
                    note.id = note._id
                    return note
                });
                return notesAdapter.setAll(initialState, loadedNotes)
            },
            providesTags : (result, error, arg) =>{
                if(result?.ids){
                    return [
                        {type:'note', id: 'LIST'},
                        ...result.ids.map(id => ({ type: 'note', id}))
                    ]
                }else return [{type: 'note',id : 'LIST'}]
            }
        }),
        addNewNote : builder.mutation({
            query: initialNote =>({
                url: '/notes',
                method: 'POST',
                body: {
                    ...initialNote
                }
            }),
            invalidatesTags: [
                {type: 'Note', id: 'LIST'}
            ]
        }),
        updateNote : builder.mutation({
            query: initialNote =>({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...initialNote
                }
            }),
            invalidatesTags: (result, error, arg)=> [
                {type: 'Note', id: arg.id}
            ]
        }),
        deleteNote : builder.mutation({
            query: ({id}) =>({
                url: '/notes',
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags: (result, error, arg)=> [
                {type: 'Note', id: arg.id}
            ]
        }),

    }),
})


export const {
    useGetNotesQuery ,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesApiSlice;

// return the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// create memorized selector
const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data // normalized state object with ids and entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllnotes,
    selectById : selectNoteById,
    selectIds: selectNoteIds
    // Pass in a selector that returns the notes slice of state 
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)
