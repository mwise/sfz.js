module.exports = {
  dbToGain: function(db){
    return Math.pow(10, (db / 20.0 )) * 1.0
  }
}
