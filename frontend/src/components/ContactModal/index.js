import React, { useState, useEffect, useRef } from "react";
import { parseISO, format } from "date-fns";
import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Switch,
  Stack,
} from "@mui/material";

import { green, orange, red } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { TagsContainer } from "../TagsContainer";

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(250, "Too Long!")
    .required("Obrigatório"),
  number: Yup.string().min(8, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Email inválido"),
});

const ContactModal = ({ open, onClose, contactId, initialValues, onSave }) => {
  const isMounted = useRef(true);

  const initialState = {
    name: "",
    number: "",
    email: "",
    disableBot: false,
    lgpdAcceptedAt: "",
  };

  const [contact, setContact] = useState(initialState);
  const [disableBot, setDisableBot] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      if (initialValues) {
        setContact((prevState) => ({
          ...prevState,
          ...initialValues,
        }));
      }

      if (!contactId) return;

      try {
        const { data } = await api.get(`/contacts/${contactId}`);
        if (isMounted.current) {
          setContact(data);
          setDisableBot(data.disableBot);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchContact();
  }, [contactId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setContact(initialState);
  };

  const handleSaveContact = async (values) => {
    try {
      if (contactId) {
        await api.put(`/contacts/${contactId}`, { ...values, disableBot });
        handleClose();
      } else {
        const { data } = await api.post("/contacts", { ...values, disableBot });
        if (onSave) onSave(data);
        handleClose();
      }
      toast.success(i18n.t("contactModal.success"));
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {contactId
          ? i18n.t("contactModal.title.edit")
          : i18n.t("contactModal.title.add")}
      </DialogTitle>
      <Formik
        initialValues={contact}
        enableReinitialize
        validationSchema={ContactSchema}
        onSubmit={(values, actions) => {
          handleSaveContact(values);
          actions.setSubmitting(false);
        }}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                {i18n.t("contactModal.form.mainInfo")}
              </Typography>
              <Stack spacing={2}>
                <Field
                  as={TextField}
                  label={i18n.t("contactModal.form.name")}
                  name="name"
                  fullWidth
                  autoFocus
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  variant="outlined"
                />
                <Field
                  as={TextField}
                  label={i18n.t("contactModal.form.number")}
                  name="number"
                  fullWidth
                  error={touched.number && Boolean(errors.number)}
                  helperText={touched.number && errors.number}
                  variant="outlined"
                  placeholder="5519971395449"
                />
                <Field
                  as={TextField}
                  label={i18n.t("contactModal.form.email")}
                  name="email"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  variant="outlined"
                  placeholder="Endereço de Email"
                />
                <TagsContainer contact={contact} />
              </Stack>

              <Box mt={3}>
                <Typography variant="subtitle1">
                  <Switch
                    size="small"
                    checked={disableBot}
                    onChange={() => setDisableBot(!disableBot)}
                  />
                  {i18n.t("contactModal.form.chatBotContact")}
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle1">
                  {i18n.t("contactModal.form.whatsapp")}{" "}
                  {contact?.whatsapp ? contact?.whatsapp.name : ""}
                </Typography>
                <Typography variant="subtitle1">
                  {i18n.t("contactModal.form.termsLGDP")}{" "}
                  {contact?.lgpdAcceptedAt
                    ? format(new Date(contact?.lgpdAcceptedAt), "dd/MM/yyyy 'às' HH:mm")
                    : ""}
                </Typography>
              </Box>

              <FieldArray name="extraInfo">
                {({ push, remove }) => (
                  <>
                    {values.extraInfo &&
                      values.extraInfo.map((info, index) => (
                        <Stack
                          key={index}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          mt={2}
                        >
                          <Field
                            as={TextField}
                            label={i18n.t("contactModal.form.extraName")}
                            name={`extraInfo[${index}].name`}
                            fullWidth
                            variant="outlined"
                          />
                          <Field
                            as={TextField}
                            label={i18n.t("contactModal.form.extraValue")}
                            name={`extraInfo[${index}].value`}
                            fullWidth
                            variant="outlined"
                          />
                          <IconButton onClick={() => remove(index)}>
                            <DeleteOutlineIcon sx={{ color: red[500] }} />
                          </IconButton>
                        </Stack>
                      ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => push({ name: "", value: "" })}
		      style={{
                      color: "white",
                      backgroundColor: "#FFA500",
                      boxShadow: "none",
                      borderRadius: 0,
                      fontSize: "12px",
                      }}
                    >
                      {i18n.t("contactModal.buttons.addExtraInfo")}
                    </Button>
                  </>
                )}
              </FieldArray>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                startIcon={<CancelIcon />}
		style={{
                color: "white",
                backgroundColor: "#db6565",
                boxShadow: "none",
                borderRadius: 0,
                fontSize: "12px",
                }}
              >
                {i18n.t("contactModal.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
		style={{
                color: "white",
                backgroundColor: "#4ec24e",
                boxShadow: "none",
                borderRadius: 0,
                fontSize: "12px",
                }}
              >
                {contactId
                  ? i18n.t("contactModal.buttons.okEdit")
                  : i18n.t("contactModal.buttons.okAdd")}
                {isSubmitting && <CircularProgress size={24} sx={{ ml: 2 }} />}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ContactModal;
