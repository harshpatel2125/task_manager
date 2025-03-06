import { createSlice } from "@reduxjs/toolkit";

interface CreateModal {
	visible: boolean;
}

const initialState: CreateModal = {
	visible: false,
};

const createModalSlice = createSlice({
	name: "createModal",
	initialState,
	reducers: {
		openModal: (state) => {
			state.visible = true;
		},
		closeModal: (state) => {
			state.visible = false;
		},
	},
});

export const { openModal, closeModal } = createModalSlice.actions;
export default createModalSlice.reducer;
