export default function calculateExpression(expression) {
    try {
        // Evaluate the expression
        return eval(expression);
    } catch (error) {
        // Handle errors in evaluation
        console.error('Error evaluating expression:', error);
        return null;
    }
}