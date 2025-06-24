import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import { i18n } from "../../translate/i18n";
import { Button, CircularProgress, Grid, TextField, Typography } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";

import axios from "axios";
import usePlans from "../../hooks/usePlans";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    paddingBottom: 100
  },
  mainHeader: {
    marginTop: theme.spacing(1),
  },
  elementMargin: {
    padding: theme.spacing(2),
  },
  formContainer: {
    maxWidth: 500,
  },
  textRight: {
    textAlign: "right"
  }
}));

const MessagesAPI = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper
      className={classes.mainPaper}
      style={{marginLeft: "5px"}}
      // className={classes.elementMargin}
      variant="outlined"
    >
      <Typography variant="h5">
        {i18n.t("Documentación de Integración de la API")}
      </Typography>
      <Typography variant="h6" color="primary" className={classes.elementMargin}>
      {i18n.t("Enviar Mensagem de Texto:")}
      </Typography>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <br />
    <span style={{ color: 'green' }}>
      Solicitud POST para el endpoint Ejemplo: https://subdominio.tudominio.com.br/api/messages/send
    </span>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Enviar Mensaje de Texto")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`fetch('https://subdominio.seudominio.com.br/api/messages/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'seu token de conexão'
  },
  body: JSON.stringify({
    number: '5519971395449',
    body: 'Mensagem'
  })
})`}
    </pre>
  </Typography>
</Grid>


<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Enviar Mensaje de Multimedia")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`const formData = new FormData();
formData.append('number', '5519971395449');
formData.append('body', 'Mensagem');
formData.append('url', 'https://imagem.com');

fetch('https://subdominio.seudominio.com.br/api/messages/send', {
  method: 'POST',
  headers: {
    'Authorization': 'seu token de conexão'
  },
  body: formData
})`}
    </pre>
  </Typography>
</Grid>

{/* Divisor */}
<Grid item xs={12}>
  <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <br />
    <span style={{ color: 'green' }}>
      Solicitud POST para el endpoint Ejemplo: https://subdominio.tudominio.com.br/api/contactCreate
    </span>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Crear Contacto")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`fetch('https://subdominio.seudominio.com.br/api/contactCreate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'cedc4174-b5a8-4235-a50c-f9b0ce6f3ce0'
  },
  body: JSON.stringify({ 
    name: 'Novo Contato',
    email: 'novocontato@exemplo.com.br',
    phone: '19971395449'
  })
})`}
    </pre>
  </Typography>
</Grid>

{/* Divisor */}

<Grid item xs={12}>
  <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <br />
    <span style={{ color: 'green' }}>
      Envíe una solicitud PUT al endpoint Ejemplo: https://subdominio.tudominio.com.br/api/updateTicket
    </span>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Actualizar Ticket")}
    </Typography>
<br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`fetch('https://subdominio.seudominio.com.br/api/updateTicket', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'cedc4174-b5a8-4235-a50c-f9b0ce6f3ce0'
  },
  body: JSON.stringify({
    ticketId: 91,
    updateData: {
      status: 'closed',
      userId: 1,
      queueId: null
    }
  })
})`}
    </pre>
  </Typography>
</Grid> 

{/* Divisor */}

<Grid item xs={12}>
  <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <br />
    <span style={{ color: 'green' }}>
      Envíe una solicitud PUT al endpoint Ejemplo: https://subdominio.tudominio.com.br/api/contactUpdate
    </span>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Actualizar Contacto")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`fetch('https://subdominio.seudominio.com.br/api/contactUpdate', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'cedc4174-b5a8-4235-a50c-f9b0ce6f3ce0'
  },
  body: JSON.stringify({
    contactId: 5,
    contactData: {
      name: 'Novo Nome',
      email: 'novoemail@exemplo.com.br',
      phone: '19971395449'
    }
  })
})`}
    </pre>
  </Typography>
</Grid>

{/* Divisor */}

<Grid item xs={12}>
  <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <br />
    <span style={{ color: 'green' }}>
      Envíe una solicitud DELETE al endpoint Ejemplo: https://subdominio.tudominio.com.br/api/contactRemove
    </span>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Eliminar Contacto")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`fetch('https://subdominio.seudominio.com.br/api/contactRemove', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'cedc4174-b5a8-4235-a50c-f9b0ce6f3ce0'
  },
  body: JSON.stringify({
    contactId: 5
  })
})`}
    </pre>
  </Typography>
</Grid>



{/* Divisor */}

<Grid item xs={12}>
  <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <br />
    <span style={{ color: 'green' }}>
      Envíe una solicitud POST al endpoint Ejemplo: https://subdominio.tudominio.com.br/api/companyCreate
    </span>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Crear Empresa")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`fetch('https://subdominio.seudominio.com.br/api/companyCreate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'cedc4174-b5a8-4235-a50c-f9b0ce6f3ce0'
  },
  body: JSON.stringify({
    "name": "Nome da Empresa",
    "email": "empresa@exemplo.com.br",
    "phone": "123456789",
    "password": "senha",
    "status": "true",
    "planId": 1,
    "dueDate": "2025-04-01",
    "recurrence": "mensal",
    "document": "123456789",
    "paymentMethod": "cartão de crédito",
    "companyUserName": "Nome do Usuário"
  })
})`}
    </pre>
  </Typography>
</Grid>


{/* Divisor */}

<Grid item xs={12}>
  <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <br />
    <span style={{ color: 'green' }}>
      Envíe una solicitud POST al endpoint Ejemplo: https://subdominio.tudominio.com.br/api/ScheduleCreate
    </span>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Crear Agendamiento")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`{
  "body": "Corpo da mensagem",
  "sendAt": "2025-04-01T12:00:00Z",
  "number": 5519971395449,
  "userId": 1,
  "recurrence": true,
  "openTicket": true,
  "connection": "1",
  "queueId": 1
}`}
    </pre>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Listar Agendamientos")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`fetch('https://subdominio.seudominio.com.br/api/scheduleList', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'cedc4174-b5a8-4235-a50c-f9b0ce6f3ce0'
  }
})`}
    </pre>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <br />
    <span style={{ color: 'green' }}>
Envíe una solicitud DELETE al endpoint Ejemplo: https://subdominio.tudominio.com.br/api/ScheduleDelete/:scheduleId, donde scheduleId es el ID del agendamiento que desea eliminar
    </span>
  </Typography>
</Grid>

<Grid item xs={12} sm={6}>
  <Typography 
    className={classes.elementMargin} 
    component="div"
  >
    <Typography 
      variant="h6"
      component="span" 
      style={{ fontWeight: 'bold' }} // Aplica o negrito
    >
      {i18n.t("Eliminar Agendamiento")}
    </Typography>
    <br />
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
      {`fetch('https://subdominio.seudominio.com.br/api/ScheduleDelete/1', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'cedc4174-b5a8-4235-a50c-f9b0ce6f3ce0'
  }
})`}
    </pre>
  </Typography>
</Grid>



    </Paper>
  );
};

export default MessagesAPI;