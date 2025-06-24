import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useHelps from "../hooks/useHelps";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { versionSystem } from "../../package.json";

import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import ViewKanban from "@mui/icons-material/ViewKanban";
import Schedule from "@material-ui/icons/Schedule";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/ListAlt";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import ForumIcon from "@material-ui/icons/Forum";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import BusinessIcon from "@material-ui/icons/Business";
import {
  AllInclusive,
  AttachFile,
  Dashboard,
  Description,
  DeviceHubOutlined,
  GridOn,
  ListAlt,
  PhonelinkSetup,
} from "@material-ui/icons";

import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { useActiveMenu } from "../context/ActiveMenuContext";

import { Can } from "../components/Can";

import { isArray } from "lodash";
import api from "../services/api";
import toastError from "../errors/toastError";
import usePlans from "../hooks/usePlans";
import useVersion from "../hooks/useVersion";
import { i18n } from "../translate/i18n";
import { Campaign, ShapeLine, Webhook } from "@mui/icons-material";
import moment from "moment";

import icoAgendamento from "../layout/icoAgendamento.png";
import icoAjuda from "../layout/icoAjuda.png";
import icoAtendimentos from "../layout/icoAtendimentos.png";
import icoCampanha from "../layout/icoCampanha.png";
import icoCampanhaConfig from "../layout/icoCampanhaConfig.png";
import icoCampanhaContatos from "../layout/icoCampanhaContatos.png";
import icoCampanhaListar from "../layout/icoCampanhaListar.png";
import icoComunicacao from "../layout/icoComunicacao.png";
import icoConexao1 from "../layout/icoConexao1.png";
import icoConexao2 from "../layout/icoConexao2.png";
import icoConfig from "../layout/icoConfig.png";
import icoContatos from "../layout/icoContatos.png";
import icoDashboard from "../layout/icoDashboard.png";
import icoEtiquetas from "../layout/icoEtiquetas.png";
import icoFinanceiro from "../layout/icoFinanceiro.png";
import icoFuncionario from "../layout/icoFuncionario.png";
import icoInformacao from "../layout/icoInformacao.png";
import icoRespostas from "../layout/icoRespostas.png";
import icoSetores from "../layout/icoSetores.png";
import icoSuporte from "../layout/icoSuporte.png";
import icoTarefas from "../layout/icoTarefas.png";
import icoChatInterno from "../layout/icoChatInterno.png";
import icoApi from "../layout/icoApi.png";
import icoIntegracoes from "../layout/icoIntegracoes.png";
import icoOpenai from "../layout/icoOpenai.png";
import icoArquivos from "../layout/icoArquivos.png";
import icoKanban from "../layout/icoKanban.png";
import icoPainelAtendimento from "../layout/icoPainelAtendimento.png";
import icoIntegracaoes from "../layout/icoIntegracaoes.png";
import icoGerenciaConexoes from "../layout/icoGerenciaConexoes.png";
import icoEmpresas from "../layout/icoEmpresas.png";
import icoQuadroKanban from "../layout/icoQuadroKanban.png";
import icoRelatorio from "../layout/icoRelatorio.png";
import icoPainel from "../layout/icoPainel.png";
import icoEmpresas2 from "../layout/icoEmpresas2.png";
import icoGeConexoes from "../layout/icoGeConexoes.png";
import icoFlow from "../layout/icoFlow.png";
import icoDocumentacao from "../layout/icoDocumentacao.png";

import './externallink.css';
import "./styles.css";

const versao = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: "-21px" }}>
        © {new Date().getFullYear()}
        {" - "}
        <Link color="inherit" href="#">
          { versionSystem }
        </Link>
        {"."}
      </Typography>
    );
  };

const useStyles = makeStyles((theme) => ({
  listItem: {
    height: "44px",
    width: "auto",
    "&:hover $iconHoverActive": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
    },
  },

  listItemText: {
    fontSize: "14px",
    color: theme.mode === "light" ? "#666" : "#FFF",
  },
  avatarActive: {
    backgroundColor: "transparent",
  },
  avatarHover: {
    backgroundColor: "transparent",
  },
  iconHoverActive: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    height: 36,
    width: 36,
    backgroundColor: theme.mode === "light" ? "rgba(120,120,120,0.1)" : "rgba(120,120,120,0.5)",
    color: theme.mode === "light" ? "#666" : "#FFF",
    // color: theme.mode === "light" ? theme.palette.primary.main : "#FFF",
    "&:hover, &.active": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.4rem",
    },
  },
}));

function ListItemLink(props) {
const { icon, primary, to, className, image, link } = props;

  const ExternalLink = ({ to, primary, image }) => {
  return (
    <ListItem button component="a" href={to} target="_blank" rel="noopener noreferrer" className="customButton">
      <ListItemIcon>
        <img src={image} alt="Icon" externallink={{ width: '24px', height: '24px' }} />
      </ListItemIcon>
      <ListItemText primary={primary} />
    </ListItem>
  );
};

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} rel="noopener noreferrer" className={`customButton ${className}`}>
        <img src={image} alt="Icon" className="icon" externallink={{ width: '24px', height: '24px' }} />
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const reducer = (state, action) => {
  if (action.type === "LOAD_CHATS") {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === "UPDATE_CHATS") {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === "DELETE_CHAT") {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  if (action.type === "CHANGE_CHAT") {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const MainListItems = ({ collapsed, drawerClose }) => {
  const theme = useTheme();
  const classes = useStyles();
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, socket } = useContext(AuthContext);
  const { setActiveMenu } = useActiveMenu();
  const location = useLocation();

  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [openFlowSubmenu, setOpenFlowSubmenu] = useState(false);
  const [openDashboardSubmenu, setOpenDashboardSubmenu] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [planExpired, setPlanExpired] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);

  // novas features
  const [showSchedules, setShowSchedules] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);

  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);
  const [version, setVersion] = useState(false);
  const [managementHover, setManagementHover] = useState(false);
  const [campaignHover, setCampaignHover] = useState(false);
  const [flowHover, setFlowHover] = useState(false)
  const { list } = useHelps();  // INSERIR
  const [hasHelps, setHasHelps] = useState(false);


  useEffect(() => {   // INSERIR ESSE EFFECT INTEIRO
    async function checkHelps() {
      const helps = await list();
      setHasHelps(helps.length > 0);
    }
    checkHelps();
  }, []);

  const isManagementActive =
    location.pathname === "/" || location.pathname.startsWith("/reports") || location.pathname.startsWith("/moments");

  const isCampaignRouteActive =
    location.pathname === "/campaigns" ||
    location.pathname.startsWith("/contact-lists") ||
    location.pathname.startsWith("/campaigns-config");

  const isFlowbuilderRouteActive = 
    location.pathname.startsWith("/phrase-lists")
    location.pathname.startsWith("/flowbuilders")

  useEffect(() => {
    if (location.pathname.startsWith("/tickets")) {
      setActiveMenu("/tickets");
    } else {
      setActiveMenu("");
    }
  }, [location, setActiveMenu]);

  const { getPlanCompany } = usePlans();

  const { getVersion } = useVersion();

  useEffect(() => {
    async function fetchVersion() {
      const _version = await getVersion();
      setVersion(_version.version);
    }
    fetchVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowKanban(planConfigs.plan.useKanban);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowInternalChat(planConfigs.plan.useInternalChat);
      setShowExternalApi(planConfigs.plan.useExternalApi);
      setPlanExpired(moment(moment().format()).isBefore(user.company.dueDate));
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    if (user.id) {
      const companyId = user.companyId;
      //    const socket = socketManager.GetSocket();
      // console.log('socket nListItems')
      const onCompanyChatMainListItems = (data) => {
        if (data.action === "new-message") {
          dispatch({ type: "CHANGE_CHAT", payload: data });
        }
        if (data.action === "update") {
          dispatch({ type: "CHANGE_CHAT", payload: data });
        }
      };

      socket.on(`company-${companyId}-chat`, onCompanyChatMainListItems);
      return () => {
        socket.off(`company-${companyId}-chat`, onCompanyChatMainListItems);
      };
    }
  }, [socket]);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  // useEffect(() => {
  //   if (localStorage.getItem("cshow")) {
  //     setShowCampaigns(true);
  //   }
  // }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div onClick={drawerClose}>
      {planExpired && (
      <Can
        role={
          (user.profile === "user" && user.showDashboard === "enabled") || user.allowRealTime === "enabled"
            ? "admin"
            : user.profile
        }
        perform={"drawer-admin-items:view"}
        yes={() => (
          <>

          </>
        )}
      />
    )}
      <Divider /> 
      <ListItemLink
        small
        to="/"
        primary={i18n.t("mainDrawer.listItems.dashboard")}
        image={icoDashboard}
      />
      <ListItemLink
        small
        to="/reports"
        primary={i18n.t("mainDrawer.listItems.reports")}
        image={icoRelatorio}
      />
      <ListItemLink
        to="/moments"
        primary={i18n.t("mainDrawer.listItems.chatsTempoReal")}
        image={icoPainel}
      />

    {planExpired && (
      <ListItemLink
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        image={icoAtendimentos}
      />
    )}

    {planExpired && (
      <ListItemLink
        to="/quick-messages"
        primary={i18n.t("mainDrawer.listItems.quickMessages")}
        image={icoRespostas}
      />
    )}

      {showKanban && planExpired && (
        <>
          <ListItemLink
            to="/kanban"
            primary={i18n.t("mainDrawer.listItems.kanban")}
            image={icoKanban}
          />
        </>
      )}

    {planExpired && (
      <ListItemLink
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        image={icoContatos}
      />
    )}

      {showSchedules && planExpired && (
        <>
          <ListItemLink
            to="/schedules"
            primary={i18n.t("mainDrawer.listItems.schedules")}
            image={icoAgendamento}
          />
        </>
      )}
    {planExpired && (
      <ListItemLink
        to="/tags"
        primary={i18n.t("mainDrawer.listItems.tags")}
        image={icoEtiquetas}
      />
    )}

      {showInternalChat && planExpired && (
        <>
          <ListItemLink
            to="/chats"
            primary={i18n.t("mainDrawer.listItems.chats")}
            image={icoChatInterno}
          />
        </>
      )}

      { <ListItemLink
        to="/todolist"
        primary={i18n.t("mainDrawer.listItems.management")}
        image={icoTarefas}
      /> }
        <ListItemLink
          to="/helps"
          primary={i18n.t("mainDrawer.listItems.helps")}
          image={icoAjuda}
      />
      )
      <Can
        role={user.profile === "user" && user.allowConnections === "enabled" ? "admin" : user.profile}
        perform="dashboard:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader inset>{i18n.t("Administración")}</ListSubheader>
            {showCampaigns && planExpired && (
              <Can
                role={user.profile}
                perform="dashboard:view"
                yes={() => (
                  <>

                  </>
                )}
              />
            )}
             <ListItemLink
               to="/flowbuilders"
               primary={i18n.t("Flujo de conversación")}
               image={icoFlow}
             />

            {/* FLOWBUILDER */}
          {planExpired && (
            <Can
              role={user.profile}
              perform="dashboard:view"
              yes={() => (
                <>
               
                </>
              )}
            />
          )}


            {user.super && (
              <ListItemLink
                to="/announcements"
                primary={i18n.t("mainDrawer.listItems.annoucements")}
                image={icoAgendamento}
                />
            )}

            {showExternalApi && planExpired && (
              <>
                <Can
                  role={user.profile}
                  perform="dashboard:view"
                  yes={() => (
                    <ListItemLink
                      to="/messages-api"
                      primary={i18n.t("mainDrawer.listItems.messagesAPI")}
                      image={icoApi}
                    />
                  )}
                />
              </>
            )}
            {planExpired && (
            <Can
              role={user.profile}
              perform="dashboard:view"
              yes={() => (
                <ListItemLink
                  to="/users"
                  primary={i18n.t("mainDrawer.listItems.users")}
                  image={icoFuncionario}
                 />
              )}
            />
            )}

          {planExpired && (
            <Can
              role={user.profile}
              perform="dashboard:view"
              yes={() => (
                <ListItemLink
                  to="/queues"
                  primary={i18n.t("mainDrawer.listItems.queues")}
                 image={icoSetores}
                 />
              )}
            />
          )}

            {showOpenAi && planExpired && (
              <Can
                role={user.profile}
                perform="dashboard:view"
                yes={() => (
                  <ListItemLink
                    to="/prompts"
                    primary={i18n.t("mainDrawer.listItems.prompts")}
                    image={icoOpenai}
                  />
                )}
              />
            )}

            {showIntegrations && planExpired && (
              <Can
                role={user.profile}
                perform="dashboard:view"
                yes={() => (
                  <ListItemLink
                    to="/queue-integration"
                    primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                    image={icoIntegracaoes}
                  />
                )}
              />
            )}

          {planExpired && (
            <Can
              role={user.profile === "user" && user.allowConnections === "enabled" ? "admin" : user.profile}
              perform={"drawer-admin-items:view"}
              yes={() => (
                <ListItemLink
                  to="/connections"
                  primary={i18n.t("mainDrawer.listItems.connections")}
                  image={icoConexao1}
                />
              )}
            />
          )}
            {user.super && (
              <ListItemLink
                to="/allConnections"
                primary={i18n.t("mainDrawer.listItems.allConnections")}
                image={icoGeConexoes}
              />
            )}
          {planExpired && (
            <Can
              role={user.profile}
              perform="dashboard:view"
              yes={() => (
                <ListItemLink
                  to="/files"
                  primary={i18n.t("mainDrawer.listItems.files")}
                  image={icoArquivos}
                />
              )}
            />
          )}


                <ListItemLink
                  to="/financeiro"
                  primary={i18n.t("mainDrawer.listItems.financeiro")}
                  image={icoFinanceiro}
               />
            <Divider />
            <ListSubheader inset>{i18n.t("Campañas")}</ListSubheader>
             <ListItemLink
               to="/campaigns"
               primary={i18n.t("mainDrawer.listItems.campaigns")}
               image={icoCampanha}
             />
             <ListItemLink
               to="/contact-lists"
               primary={i18n.t("Lista de contactos")}
               image={icoCampanhaListar}
             />
             <ListItemLink
               to="/campaigns-config"
               primary={i18n.t("mainDrawer.listItems.settings")}
               image={icoCampanhaConfig}
             />
<Divider />
      <ListItemLink
        to="/documentacao"
        primary={i18n.t("Documentación")}
        image={icoDocumentacao}
      />
          {planExpired && (
            <Can
              role={user.profile}
              perform="dashboard:view"
              yes={() => (
                <ListItemLink
                  to="/settings"
                  primary={i18n.t("mainDrawer.listItems.settings")}
                  image={icoConfig}
                />
              )}
            />
          )}
            {/* {user.super && (
              <ListSubheader inset>
                {i18n.t("mainDrawer.listItems.administration")}
              </ListSubheader>
            )} */}

            {user.super && (
              <ListItemLink
                to="/companies"
                primary={i18n.t("mainDrawer.listItems.companies")}
                image={icoEmpresas2}
              />
            )}

          </>

        )}
      />
      {!collapsed && (
        <React.Fragment>
          <Divider />
          {/* 
              // IMAGEM NO MENU
              <Hidden only={['sm', 'xs']}>
                <img style={{ width: "100%", padding: "10px" }} src={logo} alt="image" />            
              </Hidden> 
              */}
          <Typography
            style={{
              fontSize: "12px",
              padding: "10px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            { versionSystem }
          </Typography>
        </React.Fragment>
      )}
    </div>
  );
};

export default MainListItems;
