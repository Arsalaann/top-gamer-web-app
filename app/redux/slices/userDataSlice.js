//create slice for user data
import { createSlice } from "@reduxjs/toolkit";
import { update } from "./currentNavigationIndexSlice";
const userDataSlice = createSlice({
    name: "userData",
    initialState: {
        userData: {
            games: Array.from({ length: 4 }, () =>
                Array.from({ length: 5 }, () =>
                    [0, new Date().toLocaleDateString(), new Date().toLocaleTimeString()]
                ))
        },
        isLoggedIn: false
    },
    reducers: {
        setUserData: (state, action) => {
            if (!action.payload) {
                state.userData = {
                    games: Array.from({ length: 4 }, () =>
                        Array.from({ length: 5 }, () =>
                            [0, new Date().toLocaleDateString(), new Date().toLocaleTimeString()]
                        ))
                };
                state.isLoggedIn = false;
                return;
            }
            state.userData = action.payload;
            state.isLoggedIn = true;
        }
        ,
        updateUserData: (state, action) => {
            state.userData = action.payload;
        }
    }
});
export const { setUserData, updateUserData } = userDataSlice.actions;
export default userDataSlice.reducer; 