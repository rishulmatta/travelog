export default function extractInputElementValues(e) {
    const inputElements = e.target.querySelectorAll('input');
    const values = {};
    inputElements.forEach(ele => {
        if (ele.name) {
            values[ele.name] = ele.value
        }
    });

    return values;
}