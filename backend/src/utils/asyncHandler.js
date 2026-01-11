// using promises

//asyncHandler is a higher order function -> a function that can accept another function as parameter and can also return them 
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
            catch((err) => {
                next(err)
            })
    }
}


export { asyncHandler }





// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

// this is the basic code which is just a wrapper function using try and catch

// const asyncHandler = (func) => async (err, req, res, next) => {
//     try {
//         await func(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }