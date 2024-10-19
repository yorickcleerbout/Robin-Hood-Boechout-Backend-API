export const formatDateTime = (input) => {
    let split = input.split('T');
    let dateParts = split[0].split('-');
    let timeParts = split[1].split('+')[0].split(':');
    return [ `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`, `${timeParts[0]}u${timeParts[1]}` ];
};