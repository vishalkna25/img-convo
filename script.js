var droppedFiles = false;
var drop = document.getElementById("dropzone");
var tostop = ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"];
var format = ''
for (var i in tostop) {
    drop.addEventListener(tostop[i], function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.originalEvent = e;
    });
}
tostop = ["dragover", "dragenter"];
for (var i in tostop) {
    drop.addEventListener(tostop[i], function(e) {
        document.getElementById("dropzone").classList.add("bg-light");
    });
}
tostop = ["dragleave", "dragend", "drop"];
for (var i in tostop) {
    drop.addEventListener(tostop[i], function(e) {
        document.getElementById("dropzone").classList.remove("bg-light");
    });
}

drop.addEventListener("drop", function(e) {
    document.getElementById("images").files = e.originalEvent.dataTransfer.files
});

window.convertto = 'png';
window.zip = null;
var JpgToPngConvertor = function() {
    function convertor(imageFileBlob, options) {
        options = options || {};
        const defaults = {
            downloadLinkSelector: '.js-download-' + window.convertto
        };
        const settings = extend(defaults, options);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");
        const imageEl = createImage();
        const downloadLink = settings.downloadEl || createDownloadLink();

        function createImage(options) {
            options = options || {};
            const img = (Image) ? new Image() : document.createElement('img');
            const parent = options.parentEl || document.body;
            img.style.width = (options.width) ? options.width + 'px' : 'auto';
            img.style.height = (options.height) ? options.height + 'px' : 'auto';
            return img;
        }

        function extend(target, source) {
            for (let propName in source) {
                if (source.hasOwnProperty(propName)) {
                    target[propName] = source[propName];
                }
            }
            return target;
        }

        function createDownloadLink() {
            return document.createElement('a');
        }

        function isFirefox() {
            return navigator.userAgent.indexOf("Firefox") > -1;
        }

        function download(blob) {
            // Add download link to DOM in case it is not there and on the firefox
            if (!window.zip) {
                if (!document.contains(downloadLink) && isFirefox()) {
                    downloadLink.style.display = 'none';
                    document.body.appendChild(downloadLink);
                }
                if ('click' in downloadLink) {
                    downloadLink.click();
                } else {
                    downloadLink.dispatchEvent(createClickEvent());
                }
            } else {
                zip.file(document.getElementById("images").files[converted].name.substring(0, document.getElementById("images").files[converted].name.indexOf(".")) + "." + window.convertto, blob);
                converted++;
                if (converted == document.getElementById("images").files.length) {
                    zip.generateAsync({
                        type: "blob"
                    }).then(function(content) {
                        saveAs(content, "images.zip");
                    });
                }
            }

        }

        function updateDownloadLink(jpgFileName, pngBlob) {
            const linkEl = downloadLink;
            var pngFileName = "";
            if (format == 'jpeg') {
                pngFileName = jpgFileName.replace(/jpe?g/i, window.convertto);
            } else {
                pngFileName = jpgFileName.replace(format.toLowerCase(), window.convertto);
            }
            linkEl.setAttribute('download', pngFileName);
            linkEl.href = window.URL.createObjectURL(pngBlob);
            // If there is custom download link we don't download automatically
            if (settings.downloadEl) {
                settings.downloadEl.style.display = 'block';
            } else {
                download(pngBlob);
            }
        }

        function createClickEvent() {
            if ('MouseEvent' in window) {
                return new MouseEvent('click');
            } else {
                const evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window);
                return evt;
            }
        }

        function process() {
            const imageUrl = window.URL.createObjectURL(imageFileBlob);
            imageEl.onload = (e) => {
                canvas.width = e.target.width;
                canvas.height = e.target.height;
                ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
                canvas.toBlob(updateDownloadLink.bind(window, imageFileBlob.name), 'image/' + window.convertto, 1);
            };
            imageEl.src = imageUrl;
            if (settings.downloadEl) {
                settings.downloadEl.style.display = 'none';
            }
        }
        return {
            process: process
        };
    }
    return convertor;
}
var conv = new JpgToPngConvertor();
var converted = 0;
window.convert = function() {
    converted = 0;

    window.convertto = document.getElementById("FormControl").value.toLowerCase();
    /*
    if (!document.getElementById("tozip").checked) {
        window.zip = null;

        for (var i = 0; i < document.getElementById("images").files.length; i++) {
            conv(document.getElementById("images").files[i]).process();
        }
    } else {
        window.zip = new JSZip();
        for (var i = 0; i < document.getElementById("images").files.length; i++) {
            conv(document.getElementById("images").files[i]).process(zip);
        }
    }
    */
    window.zip = new JSZip();
    for (var i = 0; i < document.getElementById("images").files.length; i++) {
        conv(document.getElementById("images").files[i]).process(zip);
    }
    document.getElementsByClassName('display-container-D')[0].style.display = "none";
    document.getElementsByClassName('landing-container-D')[0].style.filter = "blur(0px)";
}

function displayFileList(){
    var input = document.getElementById('images');
    var output = document.getElementById('fileList');
    
    if(input.files.length!=0)
    {
        format = input.files.item(0).name.split('.').pop();
        document.getElementsByClassName('display-container-D')[0].style.display = "block";
        document.getElementsByClassName('landing-container-D')[0].style.filter = "blur(2px)";
        var children = "";
        for (var i = 0; i < input.files.length; ++i) {
            console.log(input.files.item(i).name);
            children +=  '<li>'+ input.files.item(i).name + '<span class="remove-list" onclick="removeFileFromFileList('+i+')">x</span>' + '</li>';
        }
        output.innerHTML = children;
    }else{
        document.getElementsByClassName('display-container-D')[0].style.display = "none";
        document.getElementsByClassName('landing-container-D')[0].style.filter = "blur(0px)";
    }
    
}

function removeFileFromFileList(index) {
    console.log(index);
    const dt = new DataTransfer();
    const input = document.getElementById('images');
    const { files } = input;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (index !== i)
        dt.items.add(file);
    }
    
    input.files = dt.files;

    displayFileList();
  }

document.getElementById("dc-close-btn").onclick = function (){
    document.getElementsByClassName('display-container-D')[0].style.display = "none";
    document.getElementsByClassName('landing-container-D')[0].style.filter = "blur(0px)";
}

var slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("review-container");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 5000);
}