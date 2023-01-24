// import React from 'react';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// class DeleteModal extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }

//     render() {
//         let status = this.props.openState;
//         let isMultipleSelected = this.props.deleteMultiple;
//         let displayName = isMultipleSelected ?  "Delete Many ?":  `${this.props.itemNameToDelete} ${this.props.item.id} ?`;

//         return (
//             <div>
//                 <Modal isOpen={status} toggle={this.toggle} className={this.props.className}>
//                     <ModalHeader className="bg-light" toggle={this.toggle}>Confirm Delete</ModalHeader>
//                     <ModalBody>
//                         {displayName}
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button color="secondary" onClick={()=>this.props.deleteCallback("no")}>No</Button>
//                         <Button color="danger" onClick={()=>this.props.deleteCallback("yes")}>Yes</Button>
//                     </ModalFooter>
//                 </Modal>
//             </div>
//         );
//     }
// }

// export default DeleteModal;
