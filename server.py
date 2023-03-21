from flask import Flask, request, make_response, Request, jsonify
from flask_cors import CORS, cross_origin
import afmformats 
import json
import io
import numpy as np

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app, resources={r"/send_data": {"origins": "*"}})


@app.route('/')

def index():
    return 'Flask backend is running'

#This is to check file extensions
ALLOWED_EXTENSIONS_TXT = {'txt'}
ALLOWED_EXTENSIONS_JPK = {'jpk-force-map'}

#Split and lower filename for checking extension
def allowed_fileTxt(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_TXT
def allowed_fileJpk(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_JPK

#Flask routing
@app.route('/send_data', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type,Authorization']) #CORS security

def send_data():
    # checking for errors, also must return a jasonified object as that is what the front end is expecting
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}) #

    file = request.files['file']
    if not file or not allowed_fileJpk(file.filename):
        return jsonify({'error': 'File type not allowed'})

    file.save('temp.jpk-force-map')
    data = afmformats.load_data('temp.jpk-force-map') #stores file in temporary file location
    customerData = {"Name": [], "Time": [], "Load": [], "Indentation": [], "Cantilever": [], "Piezo": []} #empty dictionary for storing values
    customerData['Name'].append("test") #name will actually be taken in the front end, this is just a place holder

    

    for i in range(len(data)-1):
        fd = afmformats.mod_force_distance.AFMForceDistance(
            data[i]._raw_data, data[i].metadata, diskcache=False)  #afmformats parses the jpk-force-map file
        customerData['Time'].append(0)   #data[i]['time'].tolist())
        customerData['Load'].append((fd.appr['force']*1e9).tolist() + (fd.retr['force']*1e9).tolist())
        customerData['Piezo'].append(0)   #[i]['height (piezo)'].tolist()) 
        customerData['Indentation'].append((-1*(fd.appr['height (measured)']*1e9)).tolist() + (-1*(fd.retr['height (measured)']*1e9).tolist())) # .appr takes the beginning of the curve and .retr takes the end, then are put together.
        customerData['Cantilever'].append(0)   #data[i]['segment'].tolist())                                                                       This is a built in function of afmformats
    #This is taken from source code
    headers = {'Content-Type': 'application/json'}
    
    
    return jsonify(customerData)

@app.route('/send_data_txt', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type,Authorization'])
def send_data_txt():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if not file or not allowed_fileTxt(file.filename):
        return jsonify({'error': 'File type not allowed'})


    file = request.files['file']
    file.save('temp.txt')
    f = open('temp.txt',encoding='latin1')
    stopLine = 'Time (s)'
    numeric = False
    data = []
    customerData = {'Name': [], 'Time': [], 'Load': [], 'deflection': [], 'Indentation': [], 'z': []}
    customerData['Name'].append("Test")
    for riga in f:  #This is taken from sourcecode
        if numeric is False:
            if riga[0:len(stopLine)] == stopLine:  #Stopline used as anything after that is not needed
                numeric = True
        else:
            line = riga.strip().replace(',', '.').split('\t')
            # Time (s)	Load (uN)	Indentation (nm)	Cantilever (nm)	Piezo (nm)	Auxiliary
            # skip 2 = indentation and #5 auxiliary if present
            data.append([float(line[0]), float(line[1]),
                            float(line[3]), float(line[4]),float(line[2])])
    f.close()
    data = np.array(data) #The data is much easier to manipulate in an numpy array
    max_index_indentation = data[:, 2].argmax() #Takes the max value as the rest is not needed for data
    max_index_load = data[:, 1].argmax()
    max_index = max(max_index_indentation, max_index_load)
    data = data[:max_index+1, :]
    customerData['Time'] = data[:, 0]
    customerData['Load'] = data[:, 1]*1000 #Multiplied by 1000 to scale up and be easier to work with
    customerData['deflection'] = data[:, 2]
    customerData['z'] = data[:, 3]
    customerData['Indentation'] = data[:, 4]


    customerData['Time'] = customerData['Time'].tolist()
    customerData['Load'] = customerData['Load'].tolist()
    customerData['deflection'] = customerData['deflection'].tolist()
    customerData['z'] = customerData['z'].tolist()
    customerData['Indentation'] = customerData['Indentation'].tolist()

    customerDataJson = json.dumps(customerData) #This converts to a json object, Jasonify wasn't working 100%

    return customerDataJson

if __name__ == '__main__':
    app.run(debug=True)

