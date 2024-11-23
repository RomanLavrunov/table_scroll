import './Spinner.css';

const Spinner = () => {
    return (<tr>
        <td className="loader">
            <div className="loader-animation"></div>
            <div className="loader-text">Loading...</div>
        </td>
    </tr>)
};

export default Spinner;
