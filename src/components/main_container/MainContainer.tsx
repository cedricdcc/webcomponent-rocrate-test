//this file will contain all other components that wil lbe used in this project
import React, { useState, useEffect } from "react";

//function to extract data from the rocrate.json file
function extractData(rocrate: any) {
    console.log(rocrate);
    let data = {};
    data["rocrate_context"] = rocrate["@context"];

    //loop over the @graph array and check if the @id is "./" or "ro-crate-metadata.json"
    for (let i in rocrate["@graph"]) {
        let item = rocrate["@graph"][i];
        console.log(item);
        if (item["@id"] == "./") {
            //check if the following attributs exists ["author", "datePublished", "description", "keywords", "license"] if not set them to None
            data["rocrate_author"] = item["author"] || "None";
            data["rocrate_datePublished"] = item["datePublished"] || "None";
            data["rocrate_description"] = item["description"] || "None";
            data["rocrate_keywords"] = item["keywords"] || "None";
            data["rocrate_license"] = item["license"] || "None";
        }

        if (item["@id"] == "ro-crate-metadata.json") {
            //check if @type is a string or list and if it is a list check if Profile is in the list , also get the @id of the conforms to 
            if (typeof item["@type"] == "object") {
                if (item["@type"].includes("Profile")) {
                    data["rocrate_isprofile"] = true;
                }
                else {
                    data["rocrate_isprofile"] = false;
                    
                }
            }
            data["rocrate_conformsto"] = item["conformsTo"]["@id"];
        }
        i = i + 1;
    }
    console.log(data);
    return data;
}

export default function MainContainer(props: any) {

    console.log(props.container.attributes.rocrate.value);
    const [preRocrate, setPreRocrate] = useState(props.container.attributes.rocrate.value ||{});
    const [rocrate, setRocrate] = useState(props.container.attributes.rocrate.value ||{});
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    console.log(rocrate);

    //perform the get request to get the rocrate.json file
    useEffect(() => {
        if (preRocrate.includes(".json")) {
            fetch(preRocrate)
                .then(response => response.json())
                .then(jsondata => setRocrate(jsondata))
                .then(() => console.log(rocrate))
                .then(() => setLoading(false));
        }else{
            setRocrate(preRocrate);
        }
    }, [preRocrate]);

    //when rocrate is updated extract the data from it
    useEffect(() => {
        setData(extractData(rocrate));
    }, [rocrate]);

    return (
        <div className="container">
            <br></br>
            <h1 className="accent-left-border">RO-Crate to HTML Preview Widget</h1>
            <h4 className="accent-left-border-s1">RO-Crate Metadata</h4>
            {
                //if the data is empty show a message
                loading ? <></> :
                //else loop over the data and show it

                <table>
                    <tr>
                        <th>Attribute</th>
                        <th>Value</th>
                    </tr>
                    {
                        Object.keys(data).map((key) => {
                            let key_to_show = key.replace("rocrate_", "");

                            //if data[key] is None then give tr class error_row
                            if (data[key] == "None") {
                                return (
                                    <tr className="error_row">
                                        <td><b>{key_to_show}</b></td>
                                        <td>{data[key]}</td>
                                    </tr>
                                )
                            }
                            //else give tr class normal_row
                            return (
                                <tr>
                                    <td>{key_to_show}</td>
                                    <td>{data[key]}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            }

            <h4 className="accent-left-border-s1">RO-Crate Content</h4>
            <div className="rocrate_content">
                {
                    //if the data is empty show a message
                    loading ? <></> :
                    //else loop over the data and show it
                    Object.keys(rocrate["@graph"]).map((key) => {
                        let item = rocrate["@graph"][key];
                        if (item["@id"] != "./" && item["@id"] != "ro-crate-metadata.json") {
                            return (
                                <div className="rocrate_item">
                                    <h5>{item["@id"]}</h5>
                                    <table>
                                        <tr>
                                            <th>Attribute</th>
                                            <th>Value</th>
                                        </tr>
                                        {
                                            Object.keys(item).map((key) => {
                                                let key_to_show = key.replace("@", "");

                                                //if key is @id then for Value have a link to the ./ + key
                                                if (key == "@id") {
                                                    return (
                                                        <tr>
                                                            <td>{key_to_show}</td>
                                                            <td><a href={"./" + item[key]}>{item[key]}</a></td>
                                                        </tr>
                                                    )
                                                }else{
                                                    return (
                                                        <tr>
                                                            <td>{key_to_show}</td>
                                                            <td>{item[key]}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </table>
                                </div>
                            )
                        }
                    })
                }
        </div>
    </div>
    )
}