// import React from 'react';
// import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
// import { format } from 'date-fns';

// import OswaldRegular from '../../../fonts/Oswald/static/Oswald-Regular.ttf';
// import RobotoLight from '../../../fonts/Roboto/Roboto-Light.ttf';
// import RobotoBold from '../../../fonts/Roboto/Roboto-Bold.ttf';



// Font.register({
//     family: 'OswaldRegular',
//     src: OswaldRegular
// });
// Font.register({
//     family: 'RobotoLight',
//     src: RobotoLight
// });

// Font.register({
//     family: 'RobotoBold',
//     src: RobotoBold
// });

// // Create styles
// const borderColor = '#E4E4E4';
// const styles = StyleSheet.create({
//   page: {
//         paddingTop: 35,
//         paddingBottom: 35,
//         paddingHorizontal: 15,
//     },
//     logo: {
//         width: 64,
//         height: 56,
//         marginLeft: 'auto',
//         marginRight: 'auto'
//     },
//     title: {
//         fontSize: 20,
//         textAlign: 'center',
//         fontFamily: 'OswaldRegular'
//     },
//     subTitleBold: {
//         fontSize: 12,
//         fontFamily: 'OswaldRegular'
//     },
//     titleText: {
//         fontSize: 12,
//         textAlign: 'justify',
//         fontFamily: 'OswaldRegular'
//     },
//     row: {
//         flexDirection: 'row',
//         borderBottomColor: borderColor,
//         borderRightColor: borderColor,
//         borderLeftColor: borderColor,
//         borderBottomWidth: 1,
//         borderRightWidth: 1,
//         borderLeftWidth: 1,
//         alignItems: 'center',
//         height: 24
//     },
//     rowCell: {
//         borderRightColor: borderColor,
//         borderRightWidth: 1,
//         textAlign: 'center',
//         // paddingLeft: 10,
//         flex: 1, 
//         flexWrap: 'wrap',
//         fontSize: 9,
//         fontFamily: 'RobotoLight'
//     },
//     headerCell: {
//         textAlign: 'center',
//         fontSize: 9,
//         flex: 1, 
//         flexWrap: 'wrap',
//         fontFamily: 'RobotoBold'
//     },
//     pageNumber: {
//         position: 'absolute',
//         fontSize: 12,
//         bottom: 30,
//         left: 0,
//         right: 0,
//         textAlign: 'center',
//         color: 'grey',
//         fontFamily: 'RobotoBold'
//     },
// });

// // Create Document Component
// export default function ExportPdf (props) {
//     const hasFilters = props.dateFrom != null || (props.search != null && props.search !== "");
//     const hasDates = props.dateFrom != null && props.dateTo;
//     const hasSearch = props.search != null && props.search !== "";
//     return (
//         <Document style={{width: '100%', height:'100%'}}>
//             <Page size="A4" style={styles.page}>
//                 {/* <Image style={styles.logo} src={logo} /> */}
//                 <View style={{marginVertical: 10, flexDirection: 'column'}}>
//                     <Text style={styles.title}>{`${props.reportName} Report`.toUpperCase()}</Text>
//                     {
//                         hasFilters && (
//                             <>
//                                 <Text style={[styles.subTitleBold, { marginTop: 5}]}>Filters:</Text>
//                                 { hasDates && <Text style={styles.titleText}>Date Range: <Text style={{color: '#55555c'}}>{format(props.dateFrom, 'yyyy-MM-dd')} - {format(props.dateTo, 'yyyy-MM-dd')}</Text></Text>}
//                                 { hasSearch && <Text style={styles.titleText}>Keyword: <Text style={{color: '#55555c'}}>{props.search}</Text></Text>}
//                             </>
//                         )
//                     }
                    
//                 </View>
//                 <View style={{flexDirection: 'column'}}>
//                     <View style={[styles.row, {backgroundColor: '#E4E4E4'}]} >
//                         <Text style={[styles.headerCell, {flex: 0, paddingLeft: 10, borderRightWidth: 0}]}>#</Text>
//                         {
//                             props.headers.map( header => 
//                                     <Text key={header} style={styles.headerCell}>{header}</Text>
//                             )
//                         }
//                     </View>
//                     {
//                         props.rows.map( (row, index) => 
//                             <View key={`r_${index}_${index+1}`} style={styles.row} >
//                                 <Text style={[styles.rowCell, {flex: 0, color: '#55555c', paddingLeft: 10, borderRightWidth: 0}]}>{index + 1}</Text>
//                                 {
//                                     row.map( (rw, ind) => 
//                                         <Text key={`ri_${ind}_${ind+1}`} style={[styles.rowCell, {color: '#55555c'}]}>{rw}</Text>
//                                     )
//                                 }
//                             </View>
//                         )
//                     }
//                 </View>
//                 <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
//                     `${pageNumber} / ${totalPages}`
//                 )} fixed />
//             </Page>
//         </Document>
//     );
// }
