// import React from 'react'
import React, { Component } from 'react';
import { Button} from 'reactstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


class ExportCSV extends Component {
    constructor(props){
      super(props);
      this.state = {
          loading: false
      }
    }

    exportToCSV = () => {
        let self = this;
        self.setState({loading: true});
        let url = self.props.exportDataUrl();
        if(url === undefined){
            self.setState({loading: false});
            self.props.exportErrorCallBack("Adjust your filters accordingly when exporting!");
            return;
        }
        fetch(url, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `JWT ${localStorage.getItem('token')}`
             }
          })
          .then(res => res.json())
          .then(json => {
              console.log(json)
            if(json !== null && json.length !== 0){
                if(json.length > 0){
                    let csvData = self.props.jsonDataMapper(json);
                    let fileName = self.props.fileName;
                    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                    const fileExtension = '.xlsx';
                    const ws = XLSX.utils.json_to_sheet(csvData);
                    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], {type: fileType});
                    FileSaver.saveAs(data, fileName + fileExtension);
                }
            }
            self.setState({loading: false})
          }).catch(function(error) {
            console.log(error);
            self.setState({loading: false});
            self.props.exportErrorCallBack(error.message);
          });
        
    }

    render() {
    
        return (
            <div>
                <Button style={{float: "right", color:"#ffffff"}} color="success" 
                onClick={this.exportToCSV}>
                    {!this.state.loading && <span>Export Excel</span>}
                    {this.state.loading && <span>Exporting ...</span>}
                    {this.state.loading && (
                        <i
                            className="fa fa-refresh fa-spin"
                            style={{ marginLeft: "10px" }}
                        />
                    )}
                </Button>
            </div>
        );
    }
}

export default ExportCSV;