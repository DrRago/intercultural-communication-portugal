/**
 * Created by Leonhard Gahr on 04.04.2017.
 */
init();
function init() {
    var seperator = " - ";

    var headings = document.getElementsByClassName("heading-overview");

    var reveal = document.getElementById("reveal");

    var body = document.getElementsByClassName("reveal")[0];

    var bodyChild = body.children[0];

    var topicsElement = document.createElement("div");
    topicsElement.className = "topics";

    var headElement = document.createElement("div");
    headElement.className = "head";


    var textElements = getTextElements(headings, seperator, false);

    textElements.pop();

    for (var index in textElements) {
        headElement.insertBefore(textElements[index], headElement.nextSibling)
    }

    topicsElement.insertBefore(headElement, topicsElement.nextSibling);

    bodyChild.parentNode.insertBefore(topicsElement, bodyChild.nextSibling);

    addRevealListener();

    if (Reveal.getCurrentSlide().classList.contains("no-heading-overview")) {
        document.getElementsByClassName("topics")[0].style.opacity = 0;
    }
}

function appendClass(element, newClass) {
    element.className = element.className + " " + newClass
}

function addRevealListener() {
    var elements = document.getElementsByClassName("heading-overview");
    var indices = [];
    for (var i = 0; i < elements.length; i++) {
        var slideIndices = Reveal.getIndices(elements[i].parentNode).h;
        appendClass(document.getElementsByClassName("heading-preview")[i], slideIndices);
        indices.push(slideIndices);
    }

    var recentElement;

    Reveal.addEventListener('slidechanged', function () {
        if (Reveal.getCurrentSlide().classList.contains("no-heading-overview")) {
            document.getElementsByClassName("topics")[0].style.opacity = 0
        } else {
            document.getElementsByClassName("topics")[0].style.opacity = 1
        }
        if (indices.indexOf(Reveal.getIndices().h) !== -1) {
            if (recentElement) {
                recentElement.classList.remove("active");
                recentElement.classList.add("inactive")
            }
            var element = document.getElementsByClassName("" + Reveal.getIndices().h)[0];
            recentElement = element;
            if (!element.classList.contains("active")) {
                element.classList.remove("inactive");
                element.classList.add("active");
            }
        } else {
            if (recentElement) {
                recentElement.classList.remove("active");
                recentElement.classList.add("inactive")
            }
        }
    });

    Reveal.addEventListener('overviewshown', function () {
        document.getElementsByClassName("topics")[0].style.opacity = 0
    });
    Reveal.addEventListener('overviewhidden', function () {
        document.getElementsByClassName("topics")[0].style.opacity = 1
    });

    generateTableOfContents()
}

function getTextElements(headings, seperator, noTag) {
    var textElements = [];

    for (var key in headings) {
        if (headings.hasOwnProperty(key) && headings[key].nodeType === 1) {
            if (noTag) {
                textElements.push(headings[key].innerHTML.replace("\n", " "))
            } else {
                var element = document.createElement("h4");
                if (headings[key].getAttribute("data-heading-overview") !== null) {
                    element.innerText = headings[key].getAttribute("data-heading-overview");
                } else {
                    element.innerText = headings[key].innerHTML.replace("\n", " ");
                }
                element.className = headings[key].innerText.replace(" ", "").toLowerCase() + " heading-preview";

                var seperatorElement = document.createElement("h4");
                seperatorElement.innerText = seperator;

                textElements.push(element, seperatorElement)
            }
        }
    }

    return textElements
}

function generateTableOfContents() {
    var table_slide = document.getElementsByClassName("table-of-contents")[0];

    if (table_slide === undefined) {
        return
    }

    var textElements = getTextElements(document.getElementsByClassName("heading-overview"), "", true);

    var list = document.createElement("ul");

    for (var i in textElements) {
        list.innerHTML += "<li>" + textElements[i] + "</li>"
    }

    table_slide.innerHTML = "<" + table_slide.getAttribute("data-heading-tag") + ">" + table_slide.getAttribute("data-heading") + "</" + table_slide.getAttribute("data-heading-tag") + ">";

    table_slide.innerHTML += list.outerHTML;
}