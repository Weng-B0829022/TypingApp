// styles.js
const commonStyles = {
    container: {
      display: 'flex',
      height: '89vh',
      width: '100%',
      fontFamily: 'Arial, sans-serif',
    },
    mainContent: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '0px',
      overflowY: 'auto',
      width: '100%',
    },
  };
  
  const searchPanelStyles = {
    classPanel: {
      width: '100%',
      backgroundColor: '#f8f8f8',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      marginTop: '16px',
      marginBottom: '16px',
    },
    buttonGroup: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '4px',
      marginBottom: '4px',
      overflowY:'auto'
    },
    buttonSection: {
      margin: '16px',
    },
    searchSection: {
      gap: '4px',
      width: '100%',
    },
    searchInput: {
      width: '90%',
      marginRight: '4px',
      padding: '0px !important'
    },
    button: {
      padding: '5px'
    },
    selectedButton: {
      // 添加选中按钮的样式
    },
  };
  
  const dataTableStyles = {
    tableContainer: {
      flexGrow: 1,
      overflowY: 'auto',
      borderRadius: '8px',
      height: '55vh',
    },
    selectedRow: {
      backgroundColor: '#e6f3ff',
    },
  };
  
  const detailsPanelStyles = {
    detailsPanel: {
      width: '300px',
      marginLeft: '16px',
      marginTop: '16px',
      backgroundColor: '#f8f8f8',
      overflowY: 'auto',
      borderRadius: '8px'
    },
    detailsTitle: {
      marginBottom: '12px',
    },
    detailsContent: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '8px',
    },
  };
  
  const styles = {
    ...commonStyles,
    ...searchPanelStyles,
    ...dataTableStyles,
    ...detailsPanelStyles,
  };
  
  export default styles;
  