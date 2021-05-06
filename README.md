# web_app_bokeh
Web app with HTML/JS frontend and python as backend

# Execute code

## Modules required

- pip
- fastapi
- unicorv
- bokeh
- numpy
- aiofiles

```python
pip install fastapi uvicorn[standard] bokeh numpy
```

## Run server

```
uvicorn main:app --reload
```
Read the output message and copy paste the url into your server (e.g. http://127.0.0.1:8000)

## Remark

No need to stop the server.

### Updating output

#### After modifying js/html/css

- refresh the browser

#### After modifyin python

- nothing 

(unless code is executed when page is just open => then reload the page)
