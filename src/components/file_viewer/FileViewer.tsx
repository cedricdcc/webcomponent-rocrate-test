//this component will be used to display the content of the file

import { tryExtractWindowQueryParam } from "../../utils/hash_handler";
import FileViewer from "react-file-viewer";
import FileViewError from "./FileViewError";

export default function FileViewerComponent(props: any) {
    const rocrate = props.rocrate;
    const hash = props.hash;
    const loading = props.loading;

    return (
        loading ?
        <></>
        :
        hash ?
        tryExtractWindowQueryParam(window.location.search) == "content" ?
        rocrate["@graph"].map((item: any) => {
            if (item["@id"] == hash.replace("#", "")) {
                if (item["@type"] == "File") {
                    //get the file extension
                    const file_extension = item["@id"].split(".").pop();
                    //console.log(file_extension);
                    return (
                        <FileViewer
                            fileType={file_extension}
                            filePath={item["@id"]}
                            errorComponent={FileViewError}
                        />
                    )
                }
            }
        })
        :
        <></>
        :
        <></>
    )
}