import Task2._

object Checker2 {
def main (args: Array[String]) {
    val exp1: Expr = Var("x")
    val env1: Env = {case "x" => 10}
    val test1 = (exp1, env1)
    val exp2: Expr = Const(30)
    val env2: Env = {case "x" => 10}
    val test2 = (exp2, env2)
    val exp3: Expr = Mul(Mul(Var("x"), Var("y")), Sum(Sub(Var("x"), Const(1)), Div(Var("y"), Const(2))))  
    val env3: Env = {case "x" => 3 case "y" => 10}
    val test3 = (exp3, env3)
    val exp4: Expr =  Mul(Mul(Var("x"),Var("y")), Sub(Mul(Var("x"),Var("x")), Var("y"))) 
    val env4: Env = {case "x" => 5 case "y" => 7}
    val test4 = (exp4, env4)
    val exp5: Expr = Sum(Sum(Var("x"), Var("x")), Sum(Const(7), Var("y")))
    val env5: Env = {case "x" => 5 case "y" => 7}
    val test5 = (exp5, env5)
    val testcases = List(test1, test2, test3, test4, test5)
    val useranswer = testcases map {case (exp, env) => eval(exp, env)}
    val sol = List(10, 30, 210, 630, 24)
    println(useranswer.zip(sol).count(x => x._1 == x._2))
    }
}