const chapterSelect = document.getElementById("chapter") ;
const categorySelect = document.getElementById("category") ;


const doubleGame = () => {
    window.location.href = 'doublegame.html' ;
} ;
    
const testMode = () => {
    window.location.href = 'testMode.html' ;
}

const practiceMode = () => {
    window.location.href = 'practiceMode.html' ;
}

const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'user.html';
} ;


const updateCategory = async() => {
    chapterSelect.innerHTML = "" ;
    if (categorySelect.value === ""){
        chapterSelect.disabled = true ;
    }else if(categorySelect.value === "favorite"){
        var option = document.createElement("option");
        option.value = 1 ;
        option.text = 1 ;
        chapterSelect.add(option);
    }else{
        chapterSelect.disabled = false ;
        const url = `https://kimery.store/getChapter?category=${categorySelect.value}` ;
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const responseFrame = await response.json() ;
        const responseData = responseFrame.data ;
        var option = document.createElement("option");
        option.value = "";
        option.text = "Chapter";
        chapterSelect.add(option);
        for (var i = 0; i < responseData.length; i++) {
            var option = document.createElement("option");
            option.value = responseData[i].chapter;
            option.text = responseData[i].chapter;
            chapterSelect.add(option);
        }
    }
}

const draw = (timestampsArray, scoreArray) => {
    var data = [{
        x: timestampsArray,
        y: scoreArray,
        type: 'scatter'
      }];

      var layout = {
        title: 'Score trend',
        xaxis: {
          title: 'Timestamp',
          type: 'date',  
          tickformat: '%H:%M:%S'  
        },
        yaxis: {
          title: 'Score'
        },
        paper_bgcolor: 'rgba(0, 0, 0, 0)',  
        plot_bgcolor: 'rgba(0, 0, 0, 0)',   
        font: {
          color: 'white' 
        }
      };

      Plotly.newPlot('chart', data, layout);
}

document.getElementById("chapter").addEventListener("change", async () => {
    if(chapterSelect.value != ""){
        const url = `https://kimery.store/diagram?category=${categorySelect.value}&chapter=${chapterSelect.value}` ;
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const responseFrame = await response.json() ;
        const responseData = responseFrame.data ;
        const timestampsArray = responseData.map(item => item.time);
        const scoreArray = responseData.map(item => item.score) ;
        draw(timestampsArray, scoreArray) ;
    }
});





