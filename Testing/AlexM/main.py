
from js import document
from pyodide import create_proxy

data = [1, 2, 3
]

def double_value():
  return data[0]*2

def print_data():
  print(data)

def click():
  print("you clicked me!")

def button_click():
  pass


def setup():
  # The page is ready, clear the "page loading"
  document.getElementById("msg").innerHTML = ''

  # Create a JsProxy for the callback function
  click_proxy = create_proxy(button_click)

  # Set the listener to the callback
  e = document.getElementById("button")
  e.addEventListener("click", click_proxy)

print_data()
data = double_value()
print_data()