import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
// import { SocketContext } from "../../context/Socket/SocketContext";
import n8n from "../../assets/n8n.png";
import dialogflow from "../../assets/dialogflow.png";
import webhooks from "../../assets/webhook.png";
import typebot from "../../assets/typebot.jpg";
import flowbuilder from "../../assets/flowbuilders.png"

import { makeStyles } from "@material-ui/core/styles";

import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from "@material-ui/core";

import {
  DeleteOutline,
  Edit
} from "@material-ui/icons";

import SearchIcon from "@material-ui/icons/Search";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import IntegrationModal from "../../components/QueueIntegrationModal";
import ConfirmationModal from "../../components/ConfirmationModal";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ForbiddenPage from "../../components/ForbiddenPage";
import AddIcon from '@mui/icons-material/Add';

const reducer = (state, action) => {
  if (action.type === "LOAD_INTEGRATIONS") {
    const queueIntegration = action.payload;
    const newIntegrations = [];

    queueIntegration.forEach((integration) => {
      const integrationIndex = state.findIndex((u) => u.id === integration.id);
      if (integrationIndex !== -1) {
        state[integrationIndex] = integration;
      } else {
        newIntegrations.push(integration);
      }
    });

    return [...state, ...newIntegrations];
  }

  if (action.type === "UPDATE_INTEGRATIONS") {
    const queueIntegration = action.payload;
    const integrationIndex = state.findIndex((u) => u.id === queueIntegration.id);

    if (integrationIndex !== -1) {
      state[integrationIndex] = queueIntegration;
      return [...state];
    } else {
      return [queueIntegration, ...state];
    }
  }

  if (action.type === "DELETE_INTEGRATION") {
    const integrationId = action.payload;

    const integrationIndex = state.findIndex((u) => u.id === integrationId);
    if (integrationIndex !== -1) {
      state.splice(integrationIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  avatar: {
    width: "140px",
    height: "40px",
    borderRadius: 4
  },
}));

const QueueIntegration = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [queueIntegration, dispatch] = useReducer(reducer, []);
  //   const socketManager = useContext(SocketContext);
  const { user, socket } = useContext(AuthContext);

  const { getPlanCompany } = usePlans();
  const companyId = user.companyId;
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useIntegrations) {
        toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
        setTimeout(() => {
          history.push(`/`)
        }, 1000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchIntegrations = async () => {
        try {
          const { data } = await api.get("/queueIntegration/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_INTEGRATIONS", payload: data.queueIntegrations });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchIntegrations();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    // const socket = socketManager.GetSocket();

    const onQueueEvent = (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_INTEGRATIONS", payload: data.queueIntegration });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_INTEGRATION", payload: +data.integrationId });
      }
    };

    socket.on(`company-${companyId}-queueIntegration`, onQueueEvent);
    return () => {
      socket.off(`company-${companyId}-queueIntegration`, onQueueEvent);
    };
  }, []);

  const handleOpenUserModal = () => {
    setSelectedIntegration(null);
    setUserModalOpen(true);
  };

  const handleCloseIntegrationModal = () => {
    setSelectedIntegration(null);
    setUserModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditIntegration = (queueIntegration) => {
    setSelectedIntegration(queueIntegration);
    setUserModalOpen(true);
  };

  const handleDeleteIntegration = async (integrationId) => {
    try {
      await api.delete(`/queueIntegration/${integrationId}`);
      toast.success(i18n.t("queueIntegration.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingUser(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingUser &&
          `${i18n.t("queueIntegration.confirmationModal.deleteTitle")} ${deletingUser.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteIntegration(deletingUser.id)}
      >
        {i18n.t("queueIntegration.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <IntegrationModal
        open={userModalOpen}
        onClose={handleCloseIntegrationModal}
        aria-labelledby="form-dialog-title"
        integrationId={selectedIntegration && selectedIntegration.id}
      />
      {user.profile === "user" ?
        <ForbiddenPage />
        :
        <>
          <MainHeader>
            <Title>{i18n.t("queueIntegration.title")} ({queueIntegration.length})</Title>
            <MainHeaderButtonsWrapper>
              <TextField
                placeholder={i18n.t("queueIntegration.searchPlaceholder")}
                type="search"
                value={searchParam}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ color: "#FFA500" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                style={{
                color: "white",
                backgroundColor: "#FFA500",
                boxShadow: "none",
                borderRadius: 0
                }}
                onClick={handleOpenUserModal}
              >
                {i18n.t("queueIntegration.buttons.add")}
              </Button>
            </MainHeaderButtonsWrapper>
          </MainHeader>
          <Paper
            className={classes.mainPaper}
            variant="outlined"
            onScroll={handleScroll}
          >
<Grid container spacing={2}>
  {queueIntegration.map((integration) => (
    <Grid item xs={12} sm={6} md={4} key={integration.id}>
      <Card variant="outlined"
         style={{
         padding: "10px",
         backgroundColor: "#d7e0e4",
         boxShadow: "none",
         color: "#444394",
         }}
         >
        <CardContent style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {integration.type === "dialogflow" && (
            <Avatar src={dialogflow} className={classes.avatar} />
          )}
          {integration.type === "n8n" && (
            <Avatar src={n8n} className={classes.avatar} />
          )}
          {integration.type === "webhook" && (
            <Avatar src={webhooks} className={classes.avatar} />
          )}
          {integration.type === "typebot" && (
            <Avatar src={typebot} className={classes.avatar} />
          )}
          {integration.type === "flowbuilder" && (
            <Avatar src={flowbuilder} className={classes.avatar} />
          )}
          <div>

            <Typography variant="body2" color="textSecondary">
              {i18n.t("queueIntegration.table.name")}: {integration.name}
            </Typography>
          </div>
        </CardContent>
        <CardActions style={{ justifyContent: "flex-end" }}>
          <IconButton
            size="small"
            onClick={() => handleEditIntegration(integration)}
          >
            <Edit style={{ color: "#FFA500" }} />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => {
              setConfirmModalOpen(true);
              setDeletingUser(integration);
            }}
          >
            <DeleteOutline style={{ color: "#db6565" }} />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  ))}
  {loading && (
    <Grid item xs={12}>
      <Card variant="outlined" style={{ padding: "10px" }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {i18n.t("loading")}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )}
</Grid>
          </Paper>
        </>}
    </MainContainer>
  );
};

export default QueueIntegration;