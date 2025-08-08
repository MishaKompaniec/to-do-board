import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TodoType } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    getTodos: build.query<TodoType[], void>({
      query: () => 'todos',
      providesTags: ['Todo'],
    }),
    addTodo: build.mutation({
      query: (newTodo) => ({
        url: 'todos',
        method: 'POST',
        body: newTodo,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Todo'],
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const todo = draft.find((t) => t.id === id);
            if (todo) {
              todo.status = status;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTodo: build.mutation({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
