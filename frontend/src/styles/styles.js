import { createTheme } from '@material-ui/core/styles';

// Tema original de Whaticket sin modificaciones
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

// Exportaciones básicas necesarias para el sistema
export const colorPrimary = () => '#3f51b5';
export const colorSecondary = () => '#f50057';
export const colorBackgroundTable = () => '#fafafa';
export const colorLineTable = () => '#e0e0e0';
export const colorLineTableHover = () => '#f5f5f5';
export const colorTopTable = () => '#3f51b5';
export const colorTitleTable = () => '#212121';
export const colorSuccess = () => '#4caf50';
export const colorError = () => '#f44336';
export const colorWarning = () => '#ff9800';
export const colorInfo = () => '#2196f3';

// Funciones básicas sin estilos
export const cardStyle = () => ({});
export const buttonStyle = () => ({});

export default theme;
