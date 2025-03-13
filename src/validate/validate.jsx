import * as Yup from "yup";

export const validateForm = async ({ input, validateSchema }) => {
    try {
        await validateSchema.validate(input, {
            abortEarly: false,
        });
        return {};
    } catch (validationErrors) {
        const errors = {};
        validationErrors.inner.forEach((error) => {
            errors[error.path] = error.message;
        });
        return errors;
    }
};

export const validateLoginAdminSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

export const validateLoginSchema = Yup.object({
    email: Yup.string()
        .required("Vui lòng nhập email")
        .email("Vui lòng nhập đúng email"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

export const validateRegisterSchema = Yup.object({
    name: Yup.string().required("Vui lòng nhập họ tên"),
    email: Yup.string()
        .required("Vui lòng nhập email")
        .email("Vui lòng nhập đúng email"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
    rePassword: Yup.string().required("Vui lòng nhập lại mật khẩu"),
});

export const validateSendOtpSchema = Yup.object({
    email: Yup.string()
        .required("Vui lòng nhập email")
        .email("Vui lòng nhập đúng email"),
});

export const validateResetPasswordSchema = Yup.object({
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
    rePassword: Yup.string().required("Vui lòng nhập lại mật khẩu"),
});