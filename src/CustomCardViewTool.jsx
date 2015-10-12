import React from "react";
import VendorPrefix from "react-vendor-prefix";
import {registerToolImplementation} from "./WeaveTool.jsx";
import _ from "lodash";

export default class CustomCardViewTool extends React.Component {


    constructor(props) {
        super(props);

        this.toolPath = this.props.toolPath;
        this.headerPath = this.props.toolPath.push("header");
        this.titlePath = this.props.toolPath.push("title");
        this.attributesPath = this.props.toolPath.push("attributes");
        this.selectionKeySetPath = this.props.toolPath.push("selectionKeySet");
        this.probeKeySetPath = this.props.toolPath.push("probeKeySet");
        this.formattedRecords = [];
    }

    componentDidMount() {
        [this.headerPath,
         this.titlePath,
         this.attributesPath].forEach((path) => {
            path.addCallback(_.debounce(this.dataChanged.bind(this), 100), true, false);
        });

         this.selectionKeySetPath.addCallback(_.debounce(this.setCardsSelection.bind(this), 100));
         this.probeKeySetPath.addCallback(_.debounce(this.setCardsProbe.bind(this), 50));
    }

    setCardsSelection() {
        var selectedKeys = this.selectionKeySetPath.getKeys();
        for(var key in this.refs) {
            var ref = this.refs[key];
            if(selectedKeys.indexOf(ref.props.data.id) > -1) {
                ref.setState({
                    selected: true
                });
            }
        }
    }

    setCardsProbe() {
        var probedKeys = this.probeKeySetPath.getKeys();
        for(var key in this.refs) {
            var ref = this.refs[key];
            if(probedKeys.indexOf(ref.props.data.id) > -1) {
                ref.setState({
                    probed: true
                });
            }
        }
    }

    dataChanged() {

        var mapping = {
            header: this.headerPath.getNames().map((name) => { return this.headerPath.push(name); }),
            title: this.titlePath.getNames().map((name) => { return this.titlePath.push(name); }),
            attributes: this.attributesPath.getNames().map((name) => { return this.attributesPath.push(name); })
        };


        var attributeNames = this.attributesPath.getNames();

        this.records = this.toolPath.retrieveRecords(mapping);

        this.formattedRecords = this.records.map((record) => {
            var formattedRecord = {};
            formattedRecord.id = record.id;
            var header = "";
            if(record.hasOwnProperty("header")) {
                for(var key in record.header) {
                    header += record.header[key] + " ";
                }
            }

            formattedRecord.header = header;

            var title = "";
            if(record.hasOwnProperty("title")) {
                for(key in record.title) {
                    title += record.title[key] + " ";
                }
            }

            formattedRecord.title = title;

            var attributes = [];
            if(record.hasOwnProperty("attributes")) {
                for(var i in attributeNames) {
                    attributes.push({
                        name: this.attributesPath.push(attributeNames[i]).getValue("getMetadata('title')"),
                        value: record.attributes[i]
                    });
                }
            }

            formattedRecord.attributes = attributes;

            formattedRecord.imgUrl = record.imgUrl;
            return formattedRecord;
        });
        this.forceUpdate();
    }

    handleWeaveState() {

    }

    componentDidUpdate() {

    }

    onSelect() {
        var selectedKeys = [];
        for(var key in this.refs) {
            var ref = this.refs[key];
            if(ref.state.selected) {
                selectedKeys.push(ref.props.data.id);
            }
        }
        this.selectionKeySetPath.setKeys(selectedKeys);
    }

    onProbe() {
        var probedKeys = [];

        for(var key in this.refs) {
            var ref = this.refs[key];
            if(ref.state.probed) {
                probedKeys.push(ref.props.data.id);
            }
        }
        this.probeKeySetPath.setKeys(probedKeys);
    }

    render() {
        var cards = this.formattedRecords.map((formattedRecord, index) => {
            return <Card data={formattedRecord} key={index} ref={index} onSelect={this.onSelect.bind(this)} onProbe={this.onProbe.bind(this)}/>;
        });

        return (
            <div style={{width: "100%", height: "100%"}}>
                {
                    cards
                }
            </div>
        );
    }
}

class Card extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            probed: false,
            selected: false
        };
    }
f
    toggleSelect () {
        this.setState({
            selected: !this.state.selected
        }, this.props.onSelect);
    }

    toggleProbe () {
        this.setState({
            probed: !this.state.probed
        }, this.props.onProbe);
    }

    render() {

        var data = this.props.data;

        var contactIcon = {
            flex: 0.2,
            //backgroundColor: this.state.probed ? "#8b8c8e" : "#e9eaed",
            backgroundAlpha: "0",
            backgroundImage: "url(img/contact-icon.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
        };

        var cardStyle = {
            height: "150",
            width: "300",
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 10,
            backgroundColor: () => {
                if(this.state.probed && this.state.selected) {
                    return "#DCC6DC";
                } else if (this.state.probed) {
                    return "#dae2fc";
                } else if (this.state.selected) {
                    return "rgba(224, 141, 157, 0.4)";
                } else {
                    return "#e9eaed";
                }
            }(),
            border: "solid",
            padding: "5px",
            borderWidth: "0px",
            borderColor: "#286090",
            boxShadow: "0 1px 1px rgba(0,0,0,.05)",
            float: "left"
        };

        var cardStyleprefixed = VendorPrefix.prefix({styles: cardStyle});

        var rows = data.attributes.map((attribute, index) => {
            return (
                <tr key={index}>
                  <th>{attribute.name}</th>
                  <td>{attribute.value}</td>
                </tr>
            );
        });

        return (
            <div style={cardStyleprefixed.styles} onClick={this.toggleSelect.bind(this)} onMouseOver={this.toggleProbe.bind(this)} onMouseOut={this.toggleProbe.bind(this)}>
                <div style={{display: "flex", flexDirection: "row", flex: 0.2}}>
                    <div style={{flex: 0.8}}>
                        <p style={{fontSize: "15px", color: "#34495e"}}>
                            {
                                data.header.toUpperCase()
                            }
                        </p>
                        <p style={{fontSize: "12px", color: "#34495e", whiteSpace: "nowrap"}}>
                            {
                                data.title
                            }
                        </p>
                    </div>
                    <div style={contactIcon}/>
                </div>
                <div style={{flex: 0.8}}>
                    <table style={{width: "100%", fontSize: "11px", color: "#93a5aa"}}>
                      {
                        rows
                      }
                    </table>
                </div>
            </div>
        );
    }
}

registerToolImplementation("CustomCardViewTool", CustomCardViewTool);
