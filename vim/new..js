fs.writeFile(filePath, data, (err, data) => {
                if(err) {
                    console.log('[error]: failed to update ' + filePath)
                    return
                }
                console.log('[success]: ' + filePath + ' updated successfully')
            })