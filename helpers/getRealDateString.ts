export const getRealDateString = (dateValue: Date) => {
    var mm = dateValue.getMonth() + 1
    var dd = dateValue.getDate()

    return dateValue.getFullYear() + '-' + (mm>9 ? '' : '0') + mm + '-' + (dd>9 ? '' : '0') + dd
}