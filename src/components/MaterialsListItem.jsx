/* eslint-disable react/prop-types */
const MaterialsListItem = (props) => {
    const { material } = props;
    return (
        <div>
            <p>{material.name}</p>
            <p>{material.quantity}</p>
            <p>{material.used}</p>
            <p><button>Update</button></p>
        </div>
    )
}

export default MaterialsListItem