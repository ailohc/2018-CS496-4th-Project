import Task1._

object Checker1 {

  val mobile1 =
    ComplexMobile(Branch(3,
      ComplexMobile(Branch(2, ComplexMobile(Branch(1, SimpleMobile(1)), Branch(1, SimpleMobile(1)))),
        Branch(1, SimpleMobile(4)))),
      Branch(6, SimpleMobile(3)))
  val mobile2 =
    ComplexMobile(Branch(2, SimpleMobile(4)),
      Branch(1, ComplexMobile(Branch(1, SimpleMobile(6)), Branch(1, SimpleMobile(2)))))

  def check_score() : Int = {
    val test_cases = List(mobile1, mobile2)
    val correct_answers = List(true, false)
    val user_answers = test_cases.map(balanced)
    user_answers.zip(correct_answers).count(x => x._1 == x._2)
  }

  def main(args: Array[String]) {
    println(check_score())
  }
}
