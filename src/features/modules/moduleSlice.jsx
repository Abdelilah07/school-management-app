import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchModules = createAsyncThunk('modules/fetchModules', async () => {
    const response = await fetch('http://localhost:5000/modules'); 
    return response.json();
});

export const addModule = createAsyncThunk('modules/addModule', async (newModule) => {
    const response = await fetch('http://localhost:5000/modules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModule),
        
    });
    return response.json();
});

export const deleteModule = createAsyncThunk('modules/deleteModule', async (id) => {
    const response = await fetch(`http://localhost:5000/modules/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete module with id: ${id}`);
    }

    return id;
});


export const updateModule = createAsyncThunk('modules/updateModule', async (updatedModule) => {
    const response = await fetch(`http://localhost:5000/modules/${updatedModule.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModule),
    });
    return response.json();
});


const moduleSlice = createSlice({
    name: 'modules',
    initialState: { list: [], status: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchModules.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchModules.fulfilled, (state, action) => {
                state.list = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchModules.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addModule.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(deleteModule.fulfilled, (state, action) => {
                state.list = state.list.filter(module => module.id !== action.payload);
            })
            .addCase(updateModule.fulfilled, (state, action) => {
                const index = state.list.findIndex(module => module.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            });
    },
});

export default moduleSlice.reducer;