export default function IconBar(props){
    
    const data = props.icons
    const icons = data.map((icon)=>{
        return(
            <span key={`${icon.id}-key`}>
                <button type="button" id={icon.id} className="icon-bar-icon" style={{background: `${icon.styleBackground}`}} 
                title={icon.title} onClick={()=>{
                    document.querySelector(`#${icon.id}`).blur();
                    icon.onclick();
                }}>
                </button><span className="icon-bar-dots">..</span>
            </span>
        )
    })
    return(
        <div className="icon-bar-container">
            <div className="icon-bar">
                {icons}
            </div>
        </div>
    )

}