import React from 'react';
import '../../components/header/header.scss';


const EarnPopup = ({ show, handleClose, value }) => {
    const crossIcon = 'https://d2qrsf0anqrpxl.cloudfront.net/assets/images/cross-circle-icon.png';
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    return (
        <div className={showHideClassName}> 
            <section className="modal-main disconnect-wallet-modal comming-soon-popup">
                <div className="modal fade" >
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={handleClose}>
                                {/* &times; */}
                                <img src={crossIcon} alt="cross-icon" />
                            </button>
                            <h3 className="modal-title">{value ? value : "Staking & Gaming"}</h3>
                         </div>
                         <div className="modal-body">
                             {/* <div className="modal-body-inner" style={{ display: "block"}}>
                                 <div style={{ textAlign: "center"}}>
                                    <h3>Launching Soon</h3>
                                 </div>
                             </div> */}
                             <div className="popup-btn-img"></div>
                         </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}
export default EarnPopup;