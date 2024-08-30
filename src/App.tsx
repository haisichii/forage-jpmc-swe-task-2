import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';
import { triggerAsyncId } from 'async_hooks';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  
  showGraph: boolean, //graph is either true or false (show or hidden)
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false, //by default, we hide the graph.
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    //set condition to render graph IF showGraph is True!
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>)
    }
    
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0; //used to track how many times data is fetched.

    const interval = setInterval( () => { // () => { }  anon function, used with setinterval i.e repeat block of code x times
      
      DataStreamer.getData((serverResponds: ServerRespond[]) => { //this function actually gets data from server. serverresponds is an array of responses
        //underneath, we update the state of the component. responses from 'serverresponds' are saved to data, and showgraph is true ready to display.
        this.setState({
          data: serverResponds,
          showGraph: true,
        });

      });
      //still within the setinterval function, we increment our counter after we did all of that.
      x++
      if (x > 1000){ //here we check if we have exceeded 1000 increments to then stop the interval i.e stop fetchinf data. 1001 requests are made.
        clearInterval(interval);
      }
    }, 100); //runs every 100 milliseconds
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
