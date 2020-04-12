import { takeLatest, call, put, all } from "redux-saga/effects";
import { toast } from "react-toastify";
import api from "~/services/api";

import { updateProfileSucess, updateProfileFailure } from "./actions";

export function* updateProfile({ payload }) {
  try {
    const { name, email, avatar_id, ...rest } = payload.data;

    // eslint-disable-next-line prefer-object-spread
    const profile = Object.assign(
      { name, email, avatar_id },
      rest.oldPassword ? rest : {}
    );

    const response = yield call(api.put, "users", profile);
    toast.success("Perfil Atualizado com Sucesso");
    yield put(updateProfileSucess(response.data));
  } catch (error) {
    toast.error("Erro ao atualizar perfil!");
    yield put(updateProfileFailure());
  }
}

export default all([takeLatest("@user/UPDATE_PROFILE_REQUEST", updateProfile)]);
