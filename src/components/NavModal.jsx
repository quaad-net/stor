import './NavModal.css'

function NavModal(props){

    const navSelection = props.navMenu.map((selection)=>{ 
        const selectionTitle = selection.props.to.replace('/', '');
        const key = `nav-modal-item-${selectionTitle}`;
        return(
            <div key={key} className="nav-modal-item">{selection}
            </div>
            );
    })

    return(
        <div className="modal" id="nav-modal">
            <div className="nav-modal">
                <div className="nav-modal-items">
                    <span className="nav-modal-close">&times;</span>
                    {navSelection}
                </div>
            </div>
        </div>
    )
}

export default NavModal;