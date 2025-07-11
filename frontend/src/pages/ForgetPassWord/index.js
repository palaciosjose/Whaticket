import React, { useState } from "react";
import qs from "query-string";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import logo from "../../assets/logo.png";
import { toast } from 'react-toastify'; 
import toastError from '../../errors/toastError';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url(https://coresistemas.com/imagens/fundo09.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  paper: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "55px 30px",
    borderRadius: "12.5px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  powered: {
    color: "white",
  },
}));

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const ForgetPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  let companyId = null;
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showResetPasswordButton, setShowResetPasswordButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(""); // Estado para mensagens de erro

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    if (showAdditionalFields) {
      setShowResetPasswordButton(false);
    } else {
      setShowResetPasswordButton(true);
    }
  };

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = { email: "" };

  const [user] = useState(initialState);
  const dueDate = moment().add(3, "day").format();

const handleSendEmail = async (values) => {
  const email = values.email;
  try {
    const response = await api.post(
      `${process.env.REACT_APP_BACKEND_URL}/auth/forgetpassword/${email}`
    );
    console.log("API Response:", response.data);

    // Verificar si la respuesta fue exitosa
    if (response.data.message) {
      toast.success("¡Email enviado com sucesso!");
    } else {
      toast.error("Error al enviar email");
    }
  } catch (err) {
    console.log("API Error:", err);
    toastError(err);
  }
};

  const handleResetPassword = async (values) => {
  const email = values.email;
  const token = values.token;
  const newPassword = values.newPassword;
  const confirmPassword = values.confirmPassword;

  if (newPassword === confirmPassword) {
    try {
      const response = await api.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/resetpasswords/${email}/${token}/${newPassword}`
      );
      console.log("Reset Response:", response.data);
      setError("");
      toast.success("¡Contraseña actualizada correctamente!");
      history.push("/login");
    } catch (err) {
      console.log("Reset Error:", err);
      toast.error("Error al actualizar contraseña");
    }
  } else {
    toast.error("Las contraseñas no coinciden");
  }
};

  const isResetPasswordButtonClicked = showResetPasswordButton;
  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    newPassword: isResetPasswordButtonClicked
      ? Yup.string()
          .required("Campo obligatorio")
          .matches(
            passwordRegex,
            "Su contraseña debe tener al menos 8 caracteres, incluida una letra mayúscula, una letra minúscula y un número."
          )
      : Yup.string(), // Sem validação se não for redefinição de senha
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => isResetPasswordButtonClicked && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Las contraseñas no coinciden")
        .required("Campo obligatorio"),
      otherwise: Yup.string(), // Sem validação se não for redefinição de senha
    }),
  });

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div>
            <img
              style={{ margin: "0 auto", height: "80px", width: "100%" }}
              src={logo}
              alt="Whats"
            />
          </div>
          <Typography component="h1" variant="h5">
            {i18n.t("Cambiar Contraseña")}
          </Typography>
          <Formik
            initialValues={{
              email: "",
              token: "",
              newPassword: "",
              confirmPassword: "",
            }}
            enableReinitialize={true}
            validationSchema={UserSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                if (showResetPasswordButton) {
                  handleResetPassword(values);
                } else {
                  handleSendEmail(values);
                }
                actions.setSubmitting(false);
                toggleAdditionalFields();
              }, 400);
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      id="email"
                      label={i18n.t("signup.form.email")}
                      name="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="email"
                      required
                    />
                  </Grid>
                  {showAdditionalFields && (
                    <>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          id="token"
                          label="Código de Verificación"
                          name="token"
                          error={touched.token && Boolean(errors.token)}
                          helperText={touched.token && errors.token}
                          autoComplete="off"
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          type={showPassword ? "text" : "password"}
                          id="newPassword"
                          label="Nueva contraseña"
                          name="newPassword"
                          error={
                            touched.newPassword &&
                            Boolean(errors.newPassword)
                          }
                          helperText={
                            touched.newPassword && errors.newPassword
                          }
                          autoComplete="off"
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          label="Confirme la contraseña"
                          name="confirmPassword"
                          error={
                            touched.confirmPassword &&
                            Boolean(errors.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword &&
                            errors.confirmPassword
                          }
                          autoComplete="off"
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={toggleConfirmPasswordVisibility}
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                {showResetPasswordButton ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Redefinir Senha
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Enviar Email
                  </Button>
                )}
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link
                      href="#"
                      variant="body2"
                      component={RouterLink}
                      to="/signup"
                    >
                      {i18n.t("¿No tienes una cuenta? ¡Regístrate!")}
                    </Link>
                  </Grid>
                </Grid>
                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}
              </Form>
            )}
          </Formik>
        </div>
        <Box mt={5} />
      </Container>
    </div>
  );
};

export default ForgetPassword;
