// function catchAsync(func) {
//     return function (req, res, next) {
//         func(req, res, next).catch(next);
//     };
// }

// module.exports = catchAsync;

module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
};
