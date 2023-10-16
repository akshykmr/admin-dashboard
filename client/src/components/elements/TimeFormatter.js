export default  function formatTime({time24}) {


    const [hours, minutes] = time24.split(':');
    let formattedHours = parseInt(hours, 10);
    let amOrPm = 'AM';
  
    if (formattedHours >= 12) {
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
      amOrPm = 'PM';
    }
  
    return `${formattedHours}:${minutes} ${amOrPm}`;
  }
  