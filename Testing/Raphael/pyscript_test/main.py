import js
from js import document
from pyodide import create_proxy


###################################################################################################

def double(number):
    number -= 1
    number *= 3
    number /= 100
    number = number * number
    number -= 14
    number = number * number * number
    number -= 100
    number /= 153
    return number * 2

def manipulate_data(data):
    data = list(map(double, data))
    return data

def button_click(event):
    value = js.get_value()
    data = manipulate_data(value)
    js.store_value(data)

def setup():
    # The page is ready, clear the "page loading"
    #document.getElementById("msg").innerHTML = ''

    # Create a JsProxy for the callback function
    click_proxy = create_proxy(button_click)

    # Set the listener to the callback
    e = document.getElementById("button")
    e.addEventListener("click", click_proxy)

setup()