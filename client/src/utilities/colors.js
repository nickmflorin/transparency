import _ from 'underscore'

export const Colors = {
  series : ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5", "#1f77b4", "#aec7e8","#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"],
  fadedSeries : function(alpha){
    return _.map(Colors.series, function(hex){
      return Colors.fadeHex(hex, alpha)
    })
  },
  fadeHex : function(hex, alpha){
    var rgb = Colors.hexToRgb(hex)
    return Colors.generate_rgb_string(rgb, alpha)
  },
  generate_rgb_string: function(rgb, opacity){
      var rgb_indexed = rgb 
      if(rgb['r'] !== undefined){
          rgb_indexed = [rgb['r'],rgb['g'],rgb['b']]
      }

      var string = "rgba("
      string += String(rgb_indexed[0]) + ',' + String(rgb_indexed[1]) + ',' + String(rgb_indexed[2])
      var alpha = 1.0
      if(opacity !== undefined){
          alpha = opacity
      }
      string += ',' + String(alpha)
      string += ')'
      return string
  },
  hexToRgb: function(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  },
}