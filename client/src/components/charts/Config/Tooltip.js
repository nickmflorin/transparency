import { Style } from '../Constants'

const PointFormat = function(){

    var pointFormat = '<tr class="tooltip-container">'
    pointFormat += '<td>'
    pointFormat += '<i style="color: {series.color}" class="fa fa-circle"></i>'
    pointFormat += '<span class="tooltip-name"> {series.name} </span>'
    pointFormat += '<span class="tooltip-value"> {point.y} </span>'
    pointFormat += '</td>'
    pointFormat += '</tr>'

    return pointFormat
}

const Tooltip = {
    shared: false,
    useHTML: true,
    pointFormat: PointFormat(),
    valueDecimals: 5,
    padding: Style.Tooltip.padding,
    distance: Style.Tooltip.distance,
    borderRadius: Style.Tooltip.borderRadius,
    backgroundColor: Style.Tooltip.backgroundColor
}

export default Tooltip;