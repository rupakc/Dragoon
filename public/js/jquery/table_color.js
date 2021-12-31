$(document).ready(function() {
    var emotionColorCodes = {'Anger' : "#c44e58",
                            'Joy' : "#93d6b7",
                            'Surprise' : "#e0a35e",
                            'Fear' : "#6887d8",
                            'Disgust' : "#ce8d75",
                            'Sad' : "#96578f",
                            'Negative':"#ef868b",
                            'Positive':"#a1eaaa"
                            }
	var allCells = $(".dataframe td");
        $.each(allCells, function (index, child) {
             if(emotionColorCodes.hasOwnProperty(child.textContent)){
                $(child).css("background-color", emotionColorCodes[child.textContent]);
              }
        });
    });
