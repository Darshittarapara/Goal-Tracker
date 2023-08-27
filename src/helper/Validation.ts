import { Strings } from "config/Strings";
import * as Yup from "yup";

export const LoginFormValidation = Yup.object().shape({
    email: Yup.string().required(Strings.pleaseEnterEmail)
    .email(Strings.pleaseEnterValidEmail)
})