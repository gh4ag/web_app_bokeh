import numpy as np
############################
# BOKEH
############################
from bokeh.io import show
from bokeh.layouts import column, row
from bokeh.plotting import figure, Figure
from bokeh.resources import CDN
from bokeh.embed import json_item
# widgets
from bokeh.models import NumericInput
# from bokeh.models import ColumnDataSource, Slider, NumericInput, Label
# from bokeh.models.widgets import Tabs, Panel, Div

#from bokeh.models import CustomJS, ColumnDataSource, Slider
#from bokeh.sampledata.autompg import autompg
############################
# json
############################
import json
############################
# FAST API
############################
from typing import Optional

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles # for local .js, .css

from pydantic import BaseModel
############################
# Ressources
############################
# Accessing Bokeh widget content from JS
# https://stackoverflow.com/questions/58537180/how-to-access-and-update-bokeh-plots-or-widgets-using-an-external-javascript-cod
#

# lunch the API server
app = FastAPI()
# for adding local files that are != index.html (e.g. .js and .css)
app.mount("/static", StaticFiles(directory="."), name="static")

# used index.html as root file
@app.get("/", response_class=HTMLResponse)
def main():
	with open("index.html", "r") as html_file:
		html_content = html_file.read()
	return HTMLResponse(content=html_content, status_code=200)

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

def bokeh_app(coef):
	p = figure()
	p2 = figure()
	x = np.arange(10)
	y = x**coef
	y2 = x*coef

	ni = NumericInput(value=coef, placeholder="Value", name="coef", title="Coef")
	p.scatter(x,y)
	p2.line(x,y2, name="l1")

	r = row(p, p2)
	c = column(ni, r)
	return c

@app.get("/plot")
def read_root(coef: int = 2):
	print("coef", coef)
	c = bokeh_app(coef)
	return json.dumps(json_item(c, "plotBoard"))
